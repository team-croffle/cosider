import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { DatabaseError } from 'pg';
import { uuidv7 } from 'uuidv7';

import { FileMetadata, FileUploadRequest, FileUploadUrlResponse } from './dto';

import { DB_CONNECTION } from '@/common/constants';
import { MinioService } from '@/common/minio/minio.service';
import { RedisService } from '@/common/redis/redis.service';
import type { DrizzleDB, DrizzleTx } from '@/database/drizzle.module';
import { mediaFiles } from '@/database/schema';
import type { FileUploadPolicy, PendingUpload, PreparedUpload } from '@/types/file';

@Injectable()
export class FilesService {
  private readonly bucket: string;
  private readonly uploadTtl = 600; // 10분

  constructor(
    private readonly minio: MinioService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
    @Inject(DB_CONNECTION) private readonly db: DrizzleDB,
  ) {
    this.bucket = this.config.getOrThrow<string>('STORAGE_BUCKET');
  }

  private pendingKey(uploadToken: string): string {
    return `pending:upload:${uploadToken}`;
  }

  /**
   * presigned PUT URL + uploadToken 발급.
   * fileId를 미리 생성해 temp 경로와 Redis에 함께 저장한다.
   */
  async issueUploadToken(userId: string, dto: FileUploadRequest): Promise<FileUploadUrlResponse> {
    const fileId = uuidv7();
    const uploadToken = uuidv7();
    const ext = this.extractExt(dto.fileName);
    const tempObjectKey = this.buildTempObjectKey(userId, fileId, ext);

    const { uploadUrl } = await this.minio.getPresignedUploadUrl(this.bucket, tempObjectKey, {
      expiry: this.uploadTtl,
    });

    const pendingInfo: PendingUpload = {
      fileId,
      ownerId: userId,
      tempObjectKey,
      fileName: dto.fileName,
      mimeType: dto.mimeType,
      fileSize: dto.fileSize,
      visibility: dto.visibility,
      status: 'PENDING',
    };

    await this.redis.setJson(this.pendingKey(uploadToken), pendingInfo, this.uploadTtl);

    return {
      uploadUrl,
      uploadToken,
      expiresIn: this.uploadTtl,
    };
  }

  /**
   * Redis 토큰 선점 → MinIO 검증 → 영속 경로로 copy.
   * 도메인 서비스가 권한 검증 후, DB 트랜잭션 전에 호출한다.
   * objectKey는 문자열 또는 fileId 기반 resolver로 넘긴다.
   */
  async prepareUpload(
    userId: string,
    uploadToken: string,
    objectKeyOrResolver:
      | string
      | ((ctx: { fileId: string; fileName: string; mimeType: string }) => string),
    policy?: FileUploadPolicy,
  ): Promise<PreparedUpload> {
    const key = this.pendingKey(uploadToken);
    const pending = await this.redis.getJson<PendingUpload>(key);

    if (!pending) {
      throw new BadRequestException('INVALID_OR_EXPIRED_UPLOAD_TOKEN');
    }
    if (pending.ownerId !== userId) {
      throw new ForbiddenException('UPLOAD_TOKEN_USER_MISMATCH');
    }
    if (pending.status === 'PROCESSING') {
      throw new ConflictException('UPLOAD_TOKEN_ALREADY_IN_USE');
    }

    this.assertPolicy(pending, policy);

    const objectKey =
      typeof objectKeyOrResolver === 'function'
        ? objectKeyOrResolver({
            fileId: pending.fileId,
            fileName: pending.fileName,
            mimeType: pending.mimeType,
          })
        : objectKeyOrResolver;

    pending.status = 'PROCESSING';
    await this.redis.setJsonPreservingTtl(key, pending, this.uploadTtl);

    try {
      const stat = await this.minio.statObject(this.bucket, pending.tempObjectKey);
      if (stat.size !== pending.fileSize) {
        throw new BadRequestException('FILE_UPLOAD_SIZE_MISMATCH');
      }

      await this.minio.copyObject(this.bucket, pending.tempObjectKey, this.bucket, objectKey);

      return {
        uploadToken,
        fileId: pending.fileId,
        ownerId: pending.ownerId,
        tempObjectKey: pending.tempObjectKey,
        objectKey,
        fileName: pending.fileName,
        mimeType: pending.mimeType,
        fileSize: pending.fileSize,
        visibility: pending.visibility,
      };
    } catch (err) {
      await this.releaseToken(uploadToken, pending);
      if (
        err instanceof BadRequestException ||
        err instanceof ForbiddenException ||
        err instanceof ConflictException
      ) {
        throw err;
      }
      Logger.error(err, 'FilesService.prepareUpload');
      throw new BadRequestException('FILE_NOT_FOUND_IN_STORAGE');
    }
  }

  /**
   * 도메인 트랜잭션 안에서 media_files 레코드를 생성한다.
   * fileId는 issue 시점에 미리 생성된 값을 사용한다.
   */
  async insertPreparedFile(tx: DrizzleTx, prepared: PreparedUpload): Promise<string> {
    const [existing] = await tx
      .select({ id: mediaFiles.id })
      .from(mediaFiles)
      .where(eq(mediaFiles.id, prepared.fileId))
      .limit(1);

    if (existing) {
      return existing.id;
    }

    try {
      await tx.insert(mediaFiles).values({
        id: prepared.fileId,
        bucketName: this.bucket,
        objectKey: prepared.objectKey,
        fileName: prepared.fileName,
        mimeType: prepared.mimeType,
        fileSize: prepared.fileSize,
        visibility: prepared.visibility,
        ownerId: prepared.ownerId,
      });
      return prepared.fileId;
    } catch (err) {
      if (err instanceof DatabaseError) {
        Logger.error(err, 'FilesService.insertPreparedFile');
        throw new InternalServerErrorException('FILE_DB_INSERT_FAILED');
      }
      throw err;
    }
  }

  /**
   * DB 트랜잭션 성공 후 Redis 토큰·temp 객체를 정리한다.
   */
  async completeUpload(prepared: PreparedUpload): Promise<void> {
    await this.redis.del(this.pendingKey(prepared.uploadToken));
    try {
      await this.minio.delete(this.bucket, prepared.tempObjectKey);
    } catch (err) {
      // temp는 TTL/배치로 정리되므로 실패해도 본 흐름은 성공으로 둔다
      Logger.warn(err, 'FilesService.completeUpload.tempDelete');
    }
  }

  /**
   * DB 트랜잭션 실패 시 영속 객체 보상 삭제 + 토큰을 PENDING으로 복구한다.
   */
  async rollbackUpload(prepared: PreparedUpload): Promise<void> {
    try {
      await this.minio.delete(this.bucket, prepared.objectKey);
    } catch (err) {
      Logger.warn(err, 'FilesService.rollbackUpload.permanentDelete');
    }

    const key = this.pendingKey(prepared.uploadToken);
    const pending = await this.redis.getJson<PendingUpload>(key);
    if (!pending) return;

    pending.status = 'PENDING';
    await this.redis.setJsonPreservingTtl(key, pending, this.uploadTtl);
  }

  /**
   * 도메인이 영속 경로를 조립할 때 쓰는 헬퍼.
   * 예: buildPermanentObjectKey(`logos/workspaces/${workspaceId}`, fileId, 'png')
   */
  buildPermanentObjectKey(prefix: string, fileId: string, ext?: string): string {
    const extPart = ext ? `.${ext}` : '';
    return `${prefix}/${fileId}${extPart}`;
  }

  extractExt(fileName: string): string | undefined {
    const idx = fileName.lastIndexOf('.');
    if (idx < 0 || idx === fileName.length - 1) return undefined;
    return fileName.slice(idx + 1);
  }

  /**
   * object_id → presigned GET URL 변환
   */
  async toPresignedUrl(objectId: string | null): Promise<string | null> {
    if (!objectId) return null;
    const [file] = await this.db
      .select({ objectKey: mediaFiles.objectKey })
      .from(mediaFiles)
      .where(eq(mediaFiles.id, objectId))
      .limit(1);

    if (!file) return null;

    const { downloadUrl } = await this.minio.getPresignedDownloadUrl(this.bucket, file.objectKey);
    return downloadUrl;
  }

  async getMediaInfo(objectId: string | null): Promise<FileMetadata | null> {
    if (!objectId) return null;
    const [file] = await this.db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.id, objectId))
      .limit(1);

    if (!file) return null;

    return {
      id: file.id,
      fileName: file.fileName,
      mimeType: file.mimeType,
      fileSize: file.fileSize,
      visibility: file.visibility,
      createdAt: file.createdAt?.toISOString() ?? 'unknown',
    };
  }

  private buildTempObjectKey(userId: string, fileId: string, ext?: string): string {
    const extPart = ext ? `.${ext}` : '';
    return `temp/uploads/${userId}/${fileId}${extPart}`;
  }

  private assertPolicy(pending: PendingUpload, policy?: FileUploadPolicy): void {
    if (!policy) return;

    if (policy.maxFileSize !== undefined && pending.fileSize > policy.maxFileSize) {
      throw new BadRequestException('FILE_SIZE_EXCEEDS_LIMIT');
    }
    if (policy.allowedMimeTypes && !policy.allowedMimeTypes.includes(pending.mimeType)) {
      throw new BadRequestException('FILE_MIME_TYPE_NOT_ALLOWED');
    }
  }

  private async releaseToken(uploadToken: string, pending: PendingUpload): Promise<void> {
    pending.status = 'PENDING';
    await this.redis.setJsonPreservingTtl(this.pendingKey(uploadToken), pending, this.uploadTtl);
  }
}

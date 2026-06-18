import { EFileRefType, EFileVisibility } from '@cosider/shared';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';

import { FileMetadata, FileUploadRequest, FileUploadUrlResponse } from './dto';

import { DB_CONNECTION } from '@/common/constants';
import { MinioService } from '@/common/minio/minio.service';
import { RedisService } from '@/common/redis/redis.service';
import type { DrizzleDB } from '@/database/drizzle.module';
import { mediaFiles } from '@/database/schema';
import { PendingUpload } from '@/types/file';

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

  /**
   * presigned PUT URL + upload_token 발급
   * 각 도메인 서비스에서 type을 지정해서 호출
   */
  async issueUploadToken(userId: string, dto: FileUploadRequest): Promise<FileUploadUrlResponse> {
    const ext = dto.fileName.split('.').pop();
    const objectKey = this.buildObjectKey(userId, dto.refType, ext, dto.refId);
    const uploadToken = uuidv7();

    const { uploadUrl } = await this.minio.getPresignedUploadUrl(this.bucket, objectKey, {
      expiry: this.uploadTtl,
    });

    const pendingInfo: PendingUpload = {
      objectKey,
      fileName: dto.fileName,
      mimeType: dto.mimeType,
      fileSize: dto.fileSize,
      visibility: dto.visibility,
      refType: dto.refType,
      refId: dto.refId,
      ownerId: userId,
    };

    await this.redis.setJson<PendingUpload>(
      `pending:upload:${uploadToken}`,
      pendingInfo,
      this.uploadTtl,
    );

    return {
      uploadUrl,
      uploadToken,
      expiresIn: this.uploadTtl,
    };
  }

  /**
   * upload_token 검증 후 object_key 반환
   * 검증 완료 즉시 토큰 삭제 (재사용 방지)
   */
  async consumeUploadToken(
    userId: string,
    uploadToken: string,
    expectedType: EFileRefType,
  ): Promise<string> {
    const pending = await this.redis.getJson<PendingUpload>(`pending:upload:${uploadToken}`);

    if (!pending) {
      throw new BadRequestException('INVALID_OR_EXPIRED_UPLOAD_TOKEN');
    }
    if (pending.ownerId !== userId) {
      throw new ForbiddenException('UPLOAD_TOKEN_USER_MISMATCH');
    }
    if (pending.refType !== expectedType) {
      throw new BadRequestException('UPLOAD_TOKEN_TYPE_MISMATCH');
    }

    try {
      const stat = await this.minio.statObject(this.bucket, pending.objectKey);

      if (stat.size !== pending.fileSize) {
        throw new BadRequestException('FILE_UPLOAD_SIZE_MISMATCH');
      }
    } catch (err) {
      // 의도적으로 던진 예외인 경우 그대로 다시 던짐
      if (err instanceof BadRequestException) {
        throw err;
      }

      // 그 외의 경우는 파일이 스토리지에 존재하지 않는 것으로 간주
      Logger.error(err, 'FilesService.consumeUploadToken');
      throw new BadRequestException('FILE_NOT_FOUND_IN_STORAGE');
    }

    // 업로드 완료 후 token은 redis에서 삭제. (재사용 방지)
    await this.redis.del(`pending:upload:${uploadToken}`);

    const [media] = await this.db
      .insert(mediaFiles)
      .values({
        bucketName: this.bucket,
        objectKey: pending.objectKey,
        fileName: pending.fileName,
        mimeType: pending.mimeType,
        fileSize: pending.fileSize,
        visibility: pending.visibility,
        refType: pending.refType,
        refId: pending.refId,
        ownerId: pending.ownerId,
      })
      .returning({ id: mediaFiles.id });

    return media.id;
  }

  /**
   * object_id → presigned GET URL 변환
   * 이미지/로고 등 응답에 URL 포함할 때 사용
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

  /**
   * DB에서 파일 정보를 조회하고 presigned download url 을 발급하여 반환
   */
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
      visibility: file.visibility as EFileVisibility,
      createdAt: file.createdAt?.toISOString() ?? 'unknown',
    };
  }

  private buildObjectKey(userId: string, type: EFileRefType, ext?: string, refId?: string): string {
    const id = uuidv7();

    if (type !== EFileRefType.USER && !refId) {
      throw new BadRequestException('REF_ID_REQUIRED');
    }

    const extPart = ext ? `.${ext}` : '';

    switch (type) {
      case EFileRefType.USER:
        return `avatars/users/${userId}/${id}${extPart}`;
      case EFileRefType.WORKSPACE:
        return `logos/workspaces/${refId}/${id}${extPart}`;
      case EFileRefType.PROJECT:
        return `logos/projects/${refId}/${id}${extPart}`;
      case EFileRefType.TASK:
        return `task-attachments/${refId}/${id}${extPart}`;
      case EFileRefType.DOCUMENT:
        return `documents/${refId}/${id}${extPart}`;
      default:
        throw new BadRequestException('INVALID_FILE_TYPE');
    }
  }
}

import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { uuidv7 } from 'uuidv7';

import { MinioService } from '@/common/minio/minio.service';
import { RedisService } from '@/common/redis/redis.service';
import { DownloadUrlWithExpires, EUploadType, PendingUpload, UploadInfo } from '@/types/file';

@Injectable()
export class FilesService {
  private readonly bucket: string;
  private readonly uploadTtl = 600; // 10분

  constructor(
    private readonly minio: MinioService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.getOrThrow<string>('STORAGE_BUCKET');
  }

  /**
   * presigned PUT URL + upload_token 발급
   * 각 도메인 서비스에서 type을 지정해서 호출
   */
  async issueUploadToken(
    userId: string,
    fileName: string,
    uploadType: EUploadType,
  ): Promise<UploadInfo> {
    const ext = fileName.split('.').pop();
    const objectKey = this.buildObjectKey(userId, uploadType, ext);
    const uploadToken = uuidv7();

    const { uploadUrl } = await this.minio.getPresignedUploadUrl(this.bucket, objectKey, {
      expiry: this.uploadTtl,
    });

    await this.redis.setJson<PendingUpload>(
      `pending:upload:${uploadToken}`,
      { objectKey, userId, uploadType },
      this.uploadTtl,
    );

    return {
      uploadUrl,
      uploadToken,
      expiresAt: new Date(Date.now() + this.uploadTtl * 1000),
    };
  }

  /**
   * upload_token 검증 후 object_key 반환
   * 검증 완료 즉시 토큰 삭제 (재사용 방지)
   */
  async consumeUploadToken(
    userId: string,
    uploadToken: string,
    expectedType: EUploadType,
  ): Promise<string> {
    const pending = await this.redis.getJson<PendingUpload>(`pending:upload:${uploadToken}`);

    if (!pending) throw new BadRequestException('INVALID_OR_EXPIRED_UPLOAD_TOKEN');
    if (pending.userId !== userId) throw new ForbiddenException('UPLOAD_TOKEN_USER_MISMATCH');
    if (pending.uploadType !== expectedType)
      throw new BadRequestException('UPLOAD_TOKEN_TYPE_MISMATCH');

    await this.redis.del(`pending:upload:${uploadToken}`);

    return pending.objectKey;
  }

  /**
   * object_key → presigned GET URL 변환
   * 이미지/로고 등 응답에 URL 포함할 때 사용
   */
  async toPresignedUrl(objectKey: string | null): Promise<string | null> {
    if (!objectKey) return null;
    const { downloadUrl } = await this.minio.getPresignedDownloadUrl(this.bucket, objectKey);
    return downloadUrl;
  }

  /**
   * object_key → presigned GET URL + 만료시간 반환
   * 첨부파일 다운로드처럼 만료시간도 함께 내려줄 때 사용
   */
  async toPresignedDownload(objectKey: string): Promise<DownloadUrlWithExpires> {
    const { downloadUrl, expiresAt } = await this.minio.getPresignedDownloadUrl(
      this.bucket,
      objectKey,
    );
    return { downloadUrl, expiresAt };
  }

  private buildObjectKey(userId: string, type: EUploadType, ext?: string): string {
    const id = uuidv7();
    switch (type) {
      case EUploadType.USER_AVATAR:
        return `avatars/users/${userId}/${id}.${ext}`;
      case EUploadType.WORKSPACE_LOGO:
        return `logos/workspaces/${id}.${ext}`;
      case EUploadType.PROJECT_LOGO:
        return `logos/projects/${id}.${ext}`;
      case EUploadType.TASK_ATTACHMENT:
        return `task-attachments/${id}.${ext}`;
    }
  }
}

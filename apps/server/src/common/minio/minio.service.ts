import {
  MinioPresignedOptions,
  PresignedDownloadResult,
  PresignedUploadResult,
} from '@cosider/shared';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';

import { MINIO_CLIENT } from './minio.module';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);

  constructor(@Inject(MINIO_CLIENT) private readonly client: Minio.Client) {}

  /**
   * 없으면 자동 생성하기
   * @param bucket bucket name
   */
  private async ensureBucket(bucket: string): Promise<void> {
    const exists = await this.client.bucketExists(bucket);
    if (!exists) {
      await this.client.makeBucket(bucket, '');
      this.logger.log(`Bucket '${bucket}' is created successfully`);
    }
  }

  public async getPresignedUploadUrl(
    bucket: string,
    objectName: string,
    options: MinioPresignedOptions = {},
  ): Promise<PresignedUploadResult> {
    const { expiry = 3600 } = options;

    await this.ensureBucket(bucket);

    const uploadUrl = await this.client.presignedPutObject(bucket, objectName, expiry);

    return { uploadUrl, objectName };
  }

  public async getPresignedDownloadUrl(
    bucket: string,
    objectName: string,
    options: MinioPresignedOptions = {},
  ): Promise<PresignedDownloadResult> {
    const { expiry = 3600 } = options;

    const downloadUrl = await this.client.presignedGetObject(bucket, objectName, expiry);

    return {
      downloadUrl,
      expiresAt: new Date(Date.now() + expiry * 1000),
    };
  }

  async delete(bucket: string, objectName: string): Promise<void> {
    await this.client.removeObject(bucket, objectName);
    this.logger.log(`Deleted: ${bucket}/${objectName}`);
  }

  async deleteMany(bucket: string, objectNames: string[]): Promise<void> {
    await this.client.removeObjects(bucket, objectNames);
    this.logger.log(`Deleted ${objectNames.length} objects from ${bucket}`);
  }
}

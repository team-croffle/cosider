import { IFileUploadUrlResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class FileUploadUrlResponse implements IFileUploadUrlResponse {
  @Expose()
  uploadUrl!: string;

  @Expose()
  uploadToken!: string;

  @Expose()
  expiresIn!: number;
}

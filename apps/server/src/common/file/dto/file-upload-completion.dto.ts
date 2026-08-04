import { IFileUploadCompletionRequest } from '@cosider/shared';
import { IsOptional, IsString } from 'class-validator';

export class FileUploadCompletionRequest implements IFileUploadCompletionRequest {
  @IsString()
  @IsOptional()
  uploadUrl!: string | null;

  @IsString()
  @IsOptional()
  uploadToken!: string | null;
}

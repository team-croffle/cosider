import { EFileRefType, EFileVisibility, IFileUploadRequest } from '@cosider/shared';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FileUploadRequest implements IFileUploadRequest {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @IsNumber()
  fileSize!: number;

  @IsEnum(EFileVisibility)
  visibility: EFileVisibility = EFileVisibility.WORKSPACE;

  @IsEnum(EFileRefType)
  refType!: EFileRefType;

  @IsString()
  @IsNotEmpty()
  refId!: string;
}

import { EFileVisibility, IFileMetadata } from '@cosider/shared';

export class FileMetadata implements IFileMetadata {
  id!: string;
  fileName!: string;
  mimeType!: string;
  fileSize!: number;
  visibility!: EFileVisibility;
  createdAt!: string;
}

import { EFileRefType, EFileVisibility } from './common.enum';

export interface IMediaFile {
  id: string;
  bucketName: string;
  objectKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  visibility: EFileVisibility;
  refType: EFileRefType;
  refId: string;
  ownerId: string | null;
  createdAt: string;
}

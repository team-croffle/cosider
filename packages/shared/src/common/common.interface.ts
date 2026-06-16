import { EFileRefType, EFileVisibility } from './common.enum';

export interface MediaFile {
  id: string;
  bucketName: string;
  objectKey: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  refId: string;
  ownerId: string | null;
  refType: EFileRefType;
  visibility: EFileVisibility;
  createdAt: string;
}

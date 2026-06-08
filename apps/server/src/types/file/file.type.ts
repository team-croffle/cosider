import { EUploadType } from './file.enum';

export interface PendingUpload {
  objectKey: string;
  userId: string;
  type: EUploadType;
}

import { EUploadType } from './file.enum';

export type PendingUpload = {
  objectKey: string;
  userId: string;
  uploadType: EUploadType;
};

export type DownloadUrlWithExpires = {
  downloadUrl: string;
  expiresAt: Date;
};

export type UploadInfo = {
  uploadUrl: string;
  uploadToken: string;
  expiresAt: Date;
};

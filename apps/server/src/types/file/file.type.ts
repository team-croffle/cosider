import { IMediaFile } from '@cosider/shared';

export type PendingUpload = Omit<IMediaFile, 'id' | 'bucketName' | 'createdAt'>;

export type UploadInfo = {
  uploadUrl: string;
  uploadToken: string;
  expiresAt: Date;
};

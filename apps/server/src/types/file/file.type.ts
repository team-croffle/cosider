import { EFileVisibility } from '@cosider/shared';

export type PendingUploadStatus = 'PENDING' | 'PROCESSING';

export type PendingUpload = {
  fileId: string;
  ownerId: string;
  tempObjectKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  visibility: EFileVisibility;
  status: PendingUploadStatus;
};

/**
 * prepareUpload 이후 도메인 트랜잭션에 넘기는 준비된 업로드 상태
 */
export type PreparedUpload = {
  uploadToken: string;
  fileId: string;
  ownerId: string;
  tempObjectKey: string;
  objectKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  visibility: EFileVisibility;
};

export type FileUploadPolicy = {
  allowedMimeTypes?: string[];
  maxFileSize?: number;
};

export type UploadInfo = {
  uploadUrl: string;
  uploadToken: string;
  expiresAt: Date;
};

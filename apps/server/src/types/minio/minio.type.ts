export interface MinioPresignedOptions {
  expiry?: number;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  objectName: string;
}

export interface PresignedDownloadResult {
  downloadUrl: string;
  expiresAt: Date;
}

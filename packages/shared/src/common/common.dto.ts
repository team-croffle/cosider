import { EFileRefType, EFileVisibility } from './common.enum';

export interface FileUploadRequest {
  fileName: string;
  mimeType: string;
  fileSize: number;
  visibility: EFileVisibility;
  refType?: EFileRefType;
  refId?: string;
}

export interface FileUploadUrlResponse {
  uploadUrl: string;
  uploadToken: string;
  expiresIn: number;
}

export interface FileUploadCompletionRequest {
  uploadToken: string;
  metadata?: FileMetadata;
}

export interface FileMetadata {
  id: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  visibility: EFileVisibility;
  createdAt: string;
}

export interface CheckExistsResponse {
  isAvailable: boolean;
}

export interface PageMetaData {
  currentPage: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
}

export interface LinkDocumentDto {
  documentId: string;
}

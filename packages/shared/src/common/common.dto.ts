export interface FileUploadRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface FileUploadUrlResponse {
  uploadUrl: string;
  uploadToken: string;
  expiresIn: number;
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

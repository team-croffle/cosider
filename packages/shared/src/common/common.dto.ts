import { IMediaFile } from './common.interface';

export type IFileUploadRequest = Pick<
  IMediaFile,
  'fileName' | 'mimeType' | 'fileSize' | 'visibility' | 'refType'
> & {
  refId?: string;
};

export interface IFileUploadUrlResponse {
  uploadUrl: string;
  uploadToken: string;
  expiresIn: number;
}

export type IFileMetadata = Pick<
  IMediaFile,
  'id' | 'fileName' | 'mimeType' | 'fileSize' | 'visibility' | 'createdAt'
>;

export interface IFileUploadCompletionRequest {
  // 프론트가 s3에 업로드 할 수 있는 presignedUrl
  uploadUrl: string | null;
  // 이미지 업로드를 위해 Presigned URL 요청 시 함께 받은 Token
  uploadToken: string | null;
}

export interface ICheckExistsResponse {
  isAvailable: boolean;
}

export interface IPageMetaData {
  currentPage: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
}

export interface ILinkDocumentDto {
  documentId: string;
}

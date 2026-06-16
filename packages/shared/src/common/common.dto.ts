import { IMediaFile } from './common.interface';

export type IFileUploadRequest = Pick<
  IMediaFile,
  'originalName' | 'mimeType' | 'fileSize' | 'visibility' | 'refType' | 'refId'
>;

export interface IFileUploadUrlResponse {
  uploadUrl: string;
  uploadToken: string;
  expiresIn: number;
}

export type IFileMetadata = Pick<
  IMediaFile,
  'id' | 'originalName' | 'mimeType' | 'fileSize' | 'visibility' | 'createdAt'
>;

export interface IFileUploadCompletionRequest {
  uploadToken: string;
  metadata?: IFileMetadata;
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

import { EContentType, EDocumentType, ESourceType } from './document.enum';

export interface Document {
  id: string;
  projectId: string;
  createdBy: string;
  authorNickname: string;
  title: string;
  documentType: EDocumentType;
  contentType: EContentType;
  sourceType: ESourceType;
  content: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentHistory {
  id: string;
  documentId: string;
  content: Buffer;
  versionTag: string;
  cratedAt: Date;
}

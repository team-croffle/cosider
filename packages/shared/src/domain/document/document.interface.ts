import { EContentType, EDocumentType, ESourceType } from './document.enum';

export interface Document {
  id: string;
  projectId: string;
  authorId: string | null;
  authorNickname: string | null;
  title: string;
  documentType: EDocumentType;
  contentType: EContentType;
  sourceType: ESourceType;
  content: Buffer | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface DocumentHistory {
  id: string;
  documentId: Pick<Document, 'id'>;
  content: Buffer | null;
  versionTag: string | null;
  createdAt: Date;
}

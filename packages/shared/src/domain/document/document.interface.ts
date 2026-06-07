import { EContentType, EDocumentType, EMappedEntityType, ESourceType } from './document.enum';

export interface IDocument {
  id: string;
  projectId: string;
  authorId: string | null;
  authorNickname: string | null;
  title: string;
  documentType: EDocumentType;
  contentType: EContentType;
  sourceType: ESourceType;
  content: Buffer | null;
  contentVector: Buffer | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface IDocumentHistory {
  id: string;
  documentId: Pick<IDocument, 'id'>;
  content: Buffer;
  versionTag: string | null;
  createdAt: string;
}

export interface IWhiteboardObject {
  id: string;
  whiteboardDocId: Pick<IDocument, 'id'>;
  objectId: string;
  mappedEntityType: EMappedEntityType;
  mappedEntityId: string;
}

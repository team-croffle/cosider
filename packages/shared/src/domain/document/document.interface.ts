import { IProject } from '../project';
import { IUser, IUserProfile } from '../user';

import { EContentType, EDocumentType, EMappedEntityType, ESourceType } from './document.enum';

export interface IDocument {
  id: string;
  projectId: IProject['id'];
  authorId: IUser['id'] | null;
  authorNickname: IUserProfile['nickname'] | null;
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
  documentId: IDocument['id'];
  content: Buffer;
  versionTag: string | null;
  createdAt: string;
}

export interface IWhiteboardObject {
  id: string;
  whiteboardDocId: IDocument['id'];
  objectId: string;
  mappedEntityType: EMappedEntityType;
  mappedEntityId: string;
}

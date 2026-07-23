import { IProject } from '../project';
import { IUser, IUserProfile } from '../user';

import { EContentType, EDocumentType, EMappedEntityType, ESourceType } from './document.enum';

/** DB 테이블 계약. timestamptz 컬럼은 Date. */
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
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface IDocumentHistory {
  id: string;
  documentId: IDocument['id'];
  content: Buffer;
  versionTag: string | null;
  createdAt: Date;
}

export interface IWhiteboardObject {
  id: string;
  whiteboardDocId: IDocument['id'];
  objectId: string;
  mappedEntityType: EMappedEntityType | null;
  mappedEntityId: string | null;
}

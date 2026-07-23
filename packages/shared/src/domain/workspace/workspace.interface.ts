import { IUser } from '../user';

import { EWorkspaceStatus, EWorkspaceUserRole } from './workspace.enum';

/** DB 테이블 계약. timestamptz 컬럼은 Date. */
export interface IWorkspace {
  id: string;
  ownerId: IUser['id'];
  slug: string;
  name: string;
  status: EWorkspaceStatus;
  description: string | null;
  // ID를 통해 NestJS가 PresignedURL로 Redirect해서 제공
  logoImageId: string | null;
  createdAt: Date;
  scheduledDeleteAt: Date | null;
  deletedAt: Date | null;
}

export interface IWorkspaceMember {
  id: string;
  userId: IUser['id'];
  workspaceId: IWorkspace['id'];
  role: EWorkspaceUserRole;
  joinedAt: Date;
}

export interface IWorkspaceInvitation {
  id: string;
  workspaceId: IWorkspace['id'] | null;
  inviterId: IUser['id'] | null;
  target: string;
  token: string;
  role: EWorkspaceUserRole;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt: Date | null;
}

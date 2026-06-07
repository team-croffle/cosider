import { IUser } from '../user';

import { EWorkspaceStatus, EWorkspaceUserRole } from './workspace.enum';

export interface IWorkspace {
  id: string;
  ownerId: IUser['id'];
  slug: string;
  name: string;
  status: EWorkspaceStatus;
  description: string | null;
  logoUrl: string | null;
  createdAt: string;
  scheduledDeleteAt: string | null;
  deletedAt: string | null;
}

export interface IWorkspaceMember {
  id: string;
  userId: IUser['id'];
  workspaceId: IWorkspace['id'];
  role: EWorkspaceUserRole;
  joinedAt: string;
}

export interface IWorkspaceInvitation {
  id: string;
  workspaceId: IWorkspace['id'];
  inviterId: IUser['id'];
  target: string;
  token: string;
  role: EWorkspaceUserRole;
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}

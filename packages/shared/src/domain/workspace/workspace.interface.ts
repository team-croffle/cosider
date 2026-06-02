import { EWorkspaceStatus, EWorkspaceUserRole } from './workspace.enum';

export interface IWorkspace {
  id: string;
  ownerId: string;
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
  userId: string;
  workspaceId: string;
  role: EWorkspaceUserRole;
  joinedAt: string;
}

export interface IWorkspaceInvitation {
  id: string;
  workspaceId: string;
  inviterId: string;
  target: string;
  token: string;
  role: EWorkspaceUserRole;
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}

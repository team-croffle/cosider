import { IFileUploadCompletionRequest } from '../../common';
import { IUserProfileDetailResponse, IUserProfileResponse } from '../user';

import { EWorkspaceUserRole } from './workspace.enum';
import { IWorkspace, IWorkspaceInvitation, IWorkspaceMember } from './workspace.interface';

// Workspace Core DTOs
export type ICreateWorkspaceRequest = Pick<IWorkspace, 'name' | 'slug' | 'description'> &
  IFileUploadCompletionRequest;
export type IUpdateWorkspaceRequest = Pick<IWorkspace, 'name' | 'description' | 'slug'>;

export interface IWorkspaceDeleteAcceptedResponse {
  slug: IWorkspace['slug'];
  status: IWorkspace['status'];
  deletedAt: string | null;
  scheduledDeleteAt: string | null;
}

export interface IWorkspaceResponse {
  slug: string;
  name: string;
  status: IWorkspace['status'];
  description: string | null;
  logoImageId: string | null;
  createdAt: string;
  role: EWorkspaceUserRole;
}

export interface IWorkspaceDetailResponse extends IWorkspaceResponse {
  owner: Pick<IUserProfileResponse, 'handle' | 'nickname' | 'profileImageId'>;
  // TODO: 추후 dto 추가에 따라 구체적인 타입으로 변경
  projects: Record<string, unknown>[];
}

// Workspace Member DTOs
export type IWorkspaceMemberResponse = Pick<
  IUserProfileResponse,
  'handle' | 'nickname' | 'profileImageId'
> &
  Pick<IWorkspaceMember, 'role'> & {
    joinedAt: string;
  };

export type IUpdateMemberRoleRequest = Pick<IWorkspaceMember, 'role'>;

export interface IDelegateOwnerRequest {
  newOwnerHandle: string;
}

// Workspace Invitation DTOs
export type IMemberInviteRequest = Pick<IWorkspaceInvitation, 'target' | 'role'>;

export interface IMemberInvitationResponse extends IMemberInviteRequest {
  id: string;
  inviter: Omit<IUserProfileDetailResponse, 'email' | 'techStacks' | 'jobRole'> & {
    userId: string;
  };
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}

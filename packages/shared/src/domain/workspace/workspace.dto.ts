import { IFileUploadCompletionRequest } from '../../common';
import { IUserProfileResponse } from '../user';

import { EWorkspaceUserRole } from './workspace.enum';
import { IWorkspace, IWorkspaceMember } from './workspace.interface';

// Workspace Core DTOs
export type ICreateWorkspaceRequest = Pick<IWorkspace, 'name' | 'slug' | 'description'> &
  IFileUploadCompletionRequest;
export type IUpdateWorkspaceRequest = Pick<IWorkspace, 'name' | 'description' | 'slug'>;
export type IWorkspaceDeleteAcceptedResponse = Pick<
  IWorkspace,
  'slug' | 'status' | 'deletedAt' | 'scheduledDeleteAt'
>;

export interface IWorkspaceResponse extends Omit<
  IWorkspace,
  'id' | 'ownerId' | 'scheduledDeleteAt' | 'deletedAt'
> {
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
  Pick<IWorkspaceMember, 'role' | 'joinedAt'>;

export type IUpdateMemberRoleRequest = Pick<IWorkspaceMember, 'role'>;

export interface IDelegateOwnerRequest {
  newOwnerHandle: string;
}

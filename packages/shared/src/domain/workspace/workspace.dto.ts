import { IFileUploadCompletionRequest } from '../../common';
import { IUserProfileResponse } from '../user';

import { EWorkspaceUserRole } from './workspace.enum';
import { IWorkspace } from './workspace.interface';

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

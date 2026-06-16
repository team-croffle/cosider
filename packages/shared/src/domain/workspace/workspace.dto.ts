import { IUserProfileResponse } from '../user';

import { EWorkspaceUserRole } from './workspace.enum';
import { IWorkspace } from './workspace.interface';

export interface ICreateWorkspaceRequest extends Pick<IWorkspace, 'name' | 'slug' | 'description'> {
  // 프론트가 s3에 업로드 할 수 있는 presignedUrl
  uploadUrl: string | null;
  // 이미지 업로드를 위해 Presigned URL 요청 시 함께 받은 Token
  logoUploadToken: string | null;
}
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

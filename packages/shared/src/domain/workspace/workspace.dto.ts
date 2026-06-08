import { EWorkspaceUserRole } from './workspace.enum';
import { IWorkspace } from './workspace.interface';

export interface ICreateWorkspaceRequest extends Pick<IWorkspace, 'name' | 'slug' | 'description'> {
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
  'id' | 'ownerId' | 'scheduledDeleteAt' | 'deletedAt' | 'logoImageKey'
> {
  logoUrl: string;
  role: EWorkspaceUserRole;
}
export interface IWorkspaceDetailResponse extends IWorkspaceResponse {
  // TODO: 추후 interface 추가에 따라 구체적인 타입으로 변경
  owner: Record<string, unknown>;
  projects: Record<string, unknown>[];
}

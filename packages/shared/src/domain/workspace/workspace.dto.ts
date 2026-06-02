import { EWorkspaceUserRole } from './workspace.enum';
import { IWorkspace } from './workspace.interface';

export type ICreateWorkspaceRequest = Pick<IWorkspace, 'name' | 'slug' | 'description' | 'logoUrl'>;
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
  // TODO: 추후 interface 추가에 따라 구체적인 타입으로 변경
  owner: Record<string, unknown>;
  projects: Record<string, unknown>[];
}

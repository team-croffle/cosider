import {
  EWorkspaceStatus,
  EWorkspaceUserRole,
  IUserProfileResponse,
  IWorkspaceDetailResponse,
  IWorkspaceResponse,
} from '@cosider/shared';

export class WorkspaceResponse implements IWorkspaceResponse {
  slug!: string;
  name!: string;
  status!: EWorkspaceStatus;
  description!: string;
  logoImageId!: string | null;
  createdAt!: string;
  role!: EWorkspaceUserRole;
}

export class WorkspaceDetailResponse implements IWorkspaceDetailResponse {
  slug!: string;
  name!: string;
  status!: EWorkspaceStatus;
  description!: string;
  logoImageId!: string | null;
  createdAt!: string;
  role!: EWorkspaceUserRole;
  owner!: Pick<IUserProfileResponse, 'handle' | 'nickname' | 'profileImageId'>;
  // TODO: 프로젝트 담당자가 ProjectItemDto 정의 후 교체
  projects!: Record<string, unknown>[];
}

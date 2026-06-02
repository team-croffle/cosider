import {
  EWorkspaceStatus,
  EWorkspaceUserRole,
  IWorkspaceDetailResponse,
  IWorkspaceResponse,
} from '@cosider/shared';

export class WorkspaceResponse implements IWorkspaceResponse {
  slug!: string;
  name!: string;
  status!: EWorkspaceStatus;
  description!: string;
  logo_url!: string;
  created_at!: string;
  role!: EWorkspaceUserRole;
}

export class WorkspaceDetailResponse implements IWorkspaceDetailResponse {
  slug!: string;
  name!: string;
  status!: EWorkspaceStatus;
  description!: string;
  logo_url!: string;
  created_at!: string;
  role!: EWorkspaceUserRole;
  owner!: Record<string, unknown>;

  // TODO: 프로젝트 담당자가 ProjectItemDto 정의 후 교체
  projects!: Record<string, unknown>[];
}

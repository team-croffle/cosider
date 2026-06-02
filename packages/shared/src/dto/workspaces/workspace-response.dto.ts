import { EWorkspaceStatus } from './enums/workspace-status.enum';
import { EWorkspaceUserRole } from './enums/workspace-user-role.enum';

export class WorkspaceResponseDto {
  id: string;
  slug: string;
  name: string;
  status: EWorkspaceStatus;
  description: string;
  logo_url: string;
  role: EWorkspaceUserRole;
  created_at: string;
}

// TODO: project 담당자가 ProjectItemDto 정의 후 교체
export class ProjectItemDto {
  id: string;
  owner_name: string;
  key: string;
  sdlc_type: string;
  name: string;
  logo_url: string;
  created_at: string;
}

export class WorkspaceDetailResponseDto extends WorkspaceResponseDto {
  projects: ProjectItemDto[];
}

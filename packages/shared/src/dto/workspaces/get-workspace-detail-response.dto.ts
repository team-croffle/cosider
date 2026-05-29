import { EWorkspaceStatus } from './enums/workspace-status.enum';
import { EWorkspaceUserRole } from './enums/workspace-user-role.enum';

// TODO: project 담당자가 정의 후 교체
export class ProjectItemDto {
  id: string;
  owner_name: string;
  key: string;
  sdlc_type: string;
  name: string;
  logo_url: string;
  created_at: string;
}

export class GetWorkspaceDetailResponseDto {
  id: string;
  slug: string;
  name: string;
  status: EWorkspaceStatus;
  description: string;
  logo_url: string;
  role: EWorkspaceUserRole;
  create_at: string;
  projects: ProjectItemDto[];
}

import { EWorkspaceStatus } from './enums/workspace-status.enum';
import { EWorkspaceUserRole } from './enums/workspace-user-role.enum';

export class UpdateWorkspaceResponseDto {
  id: string;
  slug: string;
  name: string;
  status: EWorkspaceStatus;
  description: string;
  logo_url: string;
  role: EWorkspaceUserRole;
  create_at: string;
}

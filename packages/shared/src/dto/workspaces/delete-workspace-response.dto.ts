import { EWorkspaceStatus } from './enums/workspace-status.enum';

export class DeleteWorkspaceResponseDto {
  workspace_slug: string;
  status: EWorkspaceStatus;
  deleted_at: string;
  scheduled_delete_at: string;
}

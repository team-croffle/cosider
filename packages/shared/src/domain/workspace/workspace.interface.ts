import { EWorkspaceStatus } from './workspace.enum';

export interface IWorkspace {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  status: EWorkspaceStatus;
  description: string;
  logo_url: string;
  created_at: string;
  scheduled_delete_at: string;
  deleted_at: string;
}

import { EWorkspaceStatus } from './workspace.enum';

export interface IWorkspace {
  id: string;
  ownerId: string;
  slug: string;
  name: string;
  status: EWorkspaceStatus;
  description: string;
  logoUrl: string;
  createdAt: string;
  scheduledDeleteAt: string;
  deletedAt: string;
}

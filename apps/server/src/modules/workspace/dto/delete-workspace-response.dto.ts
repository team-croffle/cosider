import { EWorkspaceStatus, IWorkspaceDeleteAcceptedResponse } from '@cosider/shared';

export class WorkspaceDeleteAcceptedResponse implements IWorkspaceDeleteAcceptedResponse {
  slug!: string;
  status!: EWorkspaceStatus;
  deleted_at!: string;
  scheduled_delete_at!: string;
}

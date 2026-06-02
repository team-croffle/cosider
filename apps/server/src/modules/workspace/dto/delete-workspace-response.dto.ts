import { EWorkspaceStatus, IWorkspaceDeleteAcceptedResponse } from '@cosider/shared';

export class WorkspaceDeleteAcceptedResponse implements IWorkspaceDeleteAcceptedResponse {
  slug!: string;
  status!: EWorkspaceStatus;
  deletedAt!: string;
  scheduledDeleteAt!: string;
}

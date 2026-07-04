import { EWorkspaceStatus, IWorkspaceDeleteAcceptedResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class WorkspaceDeleteAcceptedResponse implements IWorkspaceDeleteAcceptedResponse {
  @Expose()
  slug!: string;

  @Expose()
  status!: EWorkspaceStatus;

  @Expose()
  deletedAt!: string;

  @Expose()
  scheduledDeleteAt!: string;

  constructor(data?: Partial<IWorkspaceDeleteAcceptedResponse>) {
    Object.assign(this, data);
  }
}

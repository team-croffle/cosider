import { EWorkspaceUserRole, IWorkspaceMemberResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class WorkspaceMemberResponse implements IWorkspaceMemberResponse {
  @Expose()
  handle!: string;

  @Expose()
  nickname!: string;

  @Expose()
  profileImageId!: string | null;

  @Expose()
  role!: EWorkspaceUserRole;

  @Expose()
  joinedAt!: string;

  constructor(partial: Partial<WorkspaceMemberResponse>) {
    Object.assign(this, partial);
  }
}

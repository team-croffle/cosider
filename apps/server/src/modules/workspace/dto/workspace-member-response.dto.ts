import { EWorkspaceUserRole, IWorkspaceMemberResponse } from '@cosider/shared';

export class WorkspaceMemberResponse implements IWorkspaceMemberResponse {
  handle!: string;
  nickname!: string;
  profileImageId!: string | null;
  role!: EWorkspaceUserRole;
  joinedAt!: string;
}

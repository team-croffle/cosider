import { IUser } from '../user';

/** DB 테이블 계약. timestamptz 컬럼은 Date. */
export interface IUserDashboardLayout {
  id: string;
  userId: IUser['id'];
  workspaceId: string | null;
  // JSONB
  layoutData: Record<string, unknown>;
  updatedAt: Date;
}

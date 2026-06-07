import { IUser } from '../user';

export interface IUserDashboardLayout {
  id: string;
  userId: IUser['id'];
  workspaceId: string;
  // JSONB
  layoutData: string;
  updatedAt: string;
}

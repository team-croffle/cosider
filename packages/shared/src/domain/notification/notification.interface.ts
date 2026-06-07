import { IUser } from '../user';

import { ENotificationType } from './notification.enum';

export interface INotification {
  id: string;
  userId: IUser['id'];
  type: ENotificationType;
  content: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

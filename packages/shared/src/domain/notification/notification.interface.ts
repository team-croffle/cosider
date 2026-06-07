import { ENotificationType } from './notification.enum';

export interface INotification {
  id: string;
  userId: string;
  type: ENotificationType;
  content: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

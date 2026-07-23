import { IUser } from '../user';

import { ENotificationType } from './notification.enum';

/** DB 테이블 계약. timestamptz 컬럼은 Date. */
export interface INotification {
  id: string;
  userId: IUser['id'];
  type: ENotificationType;
  content: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: Date;
}

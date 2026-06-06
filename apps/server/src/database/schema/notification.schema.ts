import { ENotificationType, INotification } from '@cosider/shared';
import { boolean, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { users } from './user.schema';

// ############### NOTIFICATIONS ###############
type NotificationSchema = Record<keyof INotification, unknown>;

export const notificationTypeEnum = pgEnum(
  'notification_type',
  Object.values(ENotificationType) as [string, ...string[]],
);

export const notifications = pgTable('notifications', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: notificationTypeEnum('type').notNull(),
  content: text('content').notNull(),
  linkUrl: text('link_url'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
} satisfies NotificationSchema);

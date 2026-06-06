import { IUserDashboardLayout } from '@cosider/shared';
import { jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { users } from './user.schema';
import { workspaces } from './workspace.schema';

// ############### USER DASHBOARD LAYOUTS ###############
type UserDashboardLayoutSchema = Record<keyof IUserDashboardLayout, unknown>;

export const userDashboardLayouts = pgTable('user_dashboard_layouts', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  layoutData: jsonb('layout_data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
} satisfies UserDashboardLayoutSchema);

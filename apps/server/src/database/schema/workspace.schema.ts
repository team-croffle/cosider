import { EWorkspaceStatus, EWorkspaceUserRole } from '@cosider/shared';
import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { users } from './user.schema';

// ############### WORKSPACES ###############

export const workspaceStatusEnum = pgEnum(
  'workspace_status',
  Object.values(EWorkspaceStatus) as [string, ...string[]],
);

export const workspaces = pgTable('workspaces', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  ownerId: uuid('owner_id')
    .references(() => users.id, { onDelete: 'restrict' })
    .notNull(),
  slug: varchar('slug', { length: 30 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  status: workspaceStatusEnum('status').notNull().default(EWorkspaceStatus.ACTIVE),
  description: text('description'),
  logo_url: text('logo_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  scheduled_delete_at: timestamp('scheduled_delete_at'),
  deleted_at: timestamp('deleted_at'), // Soft Delete
});

// ############### WORKSPACE MEMBERS ###############

export const workspaceMemberRoleEnum = pgEnum(
  'workspace_member_role',
  Object.values(EWorkspaceUserRole) as [string, ...string[]],
);

export const workspace_members = pgTable(
  'workspace_members',
  {
    id: uuid('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    workspaceId: uuid('workspace_id')
      .references(() => workspaces.id, { onDelete: 'cascade' })
      .notNull(),
    role: workspaceMemberRoleEnum('role').notNull().default(EWorkspaceUserRole.MEMBER),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (table) => [index('workspace_member_unique_idx').on(table.workspaceId, table.userId)],
);

// ############### WORKSPACE INVITATIONS ###############

export const workspaceInvitations = pgTable('workspace_invitations', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  inviterId: uuid('inviter_id').references(() => users.id, { onDelete: 'cascade' }),
  target: varchar('target', { length: 255 }).notNull(),
  token: text('token').notNull().unique(),
  role: workspaceMemberRoleEnum('role').notNull().default(EWorkspaceUserRole.MEMBER),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
});

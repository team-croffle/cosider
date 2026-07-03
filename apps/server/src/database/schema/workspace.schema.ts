import {
  EWorkspaceStatus,
  EWorkspaceUserRole,
  IWorkspace,
  IWorkspaceInvitation,
  IWorkspaceMember,
} from '@cosider/shared';
import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { mediaFiles } from './common.schema';
import { users } from './user.schema';

// ############### WORKSPACES ###############
type WorkspaceSchemaKeys = Record<keyof IWorkspace, unknown>;

export const workspaceStatusEnum = pgEnum(
  'workspace_status',
  Object.values(EWorkspaceStatus) as [EWorkspaceStatus, ...EWorkspaceStatus[]],
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
  status: workspaceStatusEnum('status')
    .$type<EWorkspaceStatus>()
    .notNull()
    .default(EWorkspaceStatus.ACTIVE),
  description: text('description'),
  logoImageId: uuid('logo_image_id').references(() => mediaFiles.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  scheduledDeleteAt: timestamp('scheduled_delete_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }), // Soft Delete
} satisfies WorkspaceSchemaKeys);

// ############### WORKSPACE MEMBERS ###############
type WorkspaceMemberSchema = Record<keyof IWorkspaceMember, unknown>;

export const workspaceMemberRoleEnum = pgEnum(
  'workspace_member_role',
  Object.values(EWorkspaceUserRole) as [EWorkspaceUserRole, ...EWorkspaceUserRole[]],
);

export const workspaceMembers = pgTable(
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
    role: workspaceMemberRoleEnum('role')
      .$type<EWorkspaceUserRole>()
      .notNull()
      .default(EWorkspaceUserRole.MEMBER),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  } satisfies WorkspaceMemberSchema,
  (table) => [uniqueIndex('workspace_member_uidx').on(table.workspaceId, table.userId)],
);

// ############### WORKSPACE INVITATIONS ###############
type WorkspaceInvitationSchema = Record<keyof IWorkspaceInvitation, unknown>;

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
} satisfies WorkspaceInvitationSchema);

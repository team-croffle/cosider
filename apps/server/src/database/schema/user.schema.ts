import { EUserCredentialProvider, EUserJobRole, EUserStatus } from '@cosider/shared';
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

// ############### USERS ###############
export const userStatusEnum = pgEnum(
  'user_status',
  Object.values(EUserStatus) as [string, ...string[]],
);

export const users = pgTable('users', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  status: userStatusEnum('status').default('PENDING').notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  twoFactorSecret: text('two_factor_secret'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ############### USER CREDENTIALS ###############

export const userCredentialProviderEnum = pgEnum(
  'user_credential_provider',
  Object.values(EUserCredentialProvider) as [string, ...string[]],
);

export const userCredentials = pgTable('user_credentials', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  provider: userCredentialProviderEnum('provider').notNull(),
  providerId: varchar('provider_id', { length: 255 }).unique().notNull(),
  credential: text('credential').notNull(),
  lastLogin: timestamp('last_login', { withTimezone: true }).defaultNow(),
});

// ############### USER BACKUP CODE ###############
export const userBackupCode = pgTable('user_backup_code', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  backupCode: text('backup_code').notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
});

// ############### USER PROFILES ###############

export const userJobRoleEnum = pgEnum(
  'user_job_role',
  Object.values(EUserJobRole) as [string, ...string[]],
);

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  handle: varchar('handle', { length: 30 }).unique().notNull(),
  nickname: varchar('nickname', { length: 100 }),
  profileImageUrl: text('profile_image_url'),
  jobRole: userJobRoleEnum('job_role').notNull(),
  techStacks: jsonb('tech_stacks'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  nicknameUpdatedAt: timestamp('nickname_updated_at', { withTimezone: true }).defaultNow(),
});

import {
  EJobRole,
  EUserCredentialProvider,
  EUserStatus,
  IUser,
  IUserBackupCode,
  IUserCredential,
  IUserProfile,
} from '@cosider/shared';
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
type UserSchemaKeys = Record<keyof IUser, unknown>;

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
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
} satisfies UserSchemaKeys);

// ############### USER CREDENTIALS ###############
type UserCredentialSchema = Record<keyof IUserCredential, unknown>;

export const userCredentialProviderEnum = pgEnum(
  'user_credential_provider',
  Object.values(EUserCredentialProvider) as [string, ...string[]],
);

export const userCredentials = pgTable('user_credentials', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  provider: userCredentialProviderEnum('provider').notNull(),
  providerId: varchar('provider_id', { length: 255 }).unique().notNull(),
  credential: text('credential').notNull(),
  lastLogin: timestamp('last_login', { withTimezone: true }).defaultNow(),
} satisfies UserCredentialSchema);

// ############### USER BACKUP CODE ###############
type UserBackupCodeSchema = Record<keyof IUserBackupCode, unknown>;

export const userBackupCodes = pgTable('user_backup_codes', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  codeHash: text('code_hash').notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
} satisfies UserBackupCodeSchema);

// ############### USER PROFILES ###############
type UserProfileSchema = Record<keyof IUserProfile, unknown>;

export const userJobRoleEnum = pgEnum(
  'user_job_role',
  Object.values(EJobRole) as [string, ...string[]],
);

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 254 }).notNull().unique(),
  handle: varchar('handle', { length: 30 }).unique().notNull(),
  nickname: varchar('nickname', { length: 100 }),
  // S3에서 Key로 접근해서 NestJS가 PresignedURL로 변환해서 제공
  profileImageKey: text('profile_image_key'),
  jobRole: userJobRoleEnum('job_role').notNull(),
  techStacks: jsonb('tech_stacks'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  nicknameUpdatedAt: timestamp('nickname_updated_at', { withTimezone: true }).defaultNow(),
} satisfies UserProfileSchema);

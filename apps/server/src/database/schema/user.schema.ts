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

import { mediaFiles } from './common.schema';

// ############### USERS ###############
type UserSchemaKeys = Record<keyof IUser, unknown>;

export const userStatusEnum = pgEnum(
  'user_status',
  Object.values(EUserStatus) as [EUserStatus, ...EUserStatus[]],
);

export const users = pgTable('users', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  // email을 이 곳으로 옮긴 이유:
  // PENDING(가입했지만 Profile이 없음) 상태인 경우, email 조회를 위해 profile을 조회?
  // => 모순 발생. Profile이 없기 떄문에, 애초에 조회에서 에러 발생함.
  // ==> email을 users로 옮겨 해결.
  // ===> PENDING 상태인 유저라도 이메일로 검색이 필요하기 때문
  email: varchar('email', { length: 254 }).notNull().unique(),
  status: userStatusEnum('status').default(EUserStatus.PENDING).notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  twoFactorSecret: text('two_factor_secret'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
} satisfies UserSchemaKeys);

// ############### USER CREDENTIALS ###############
type UserCredentialSchema = Record<keyof IUserCredential, unknown>;

export const userCredentialProviderEnum = pgEnum(
  'user_credential_provider',
  Object.values(EUserCredentialProvider) as [EUserCredentialProvider, ...EUserCredentialProvider[]],
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
  Object.values(EJobRole) as [EJobRole, ...EJobRole[]],
);

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  handle: varchar('handle', { length: 30 }).unique().notNull(),
  nickname: varchar('nickname', { length: 100 }),
  // S3에서 Key로 접근해서 NestJS가 PresignedURL로 변환해서 제공
  profileImageId: uuid('profile_image_id').references(() => mediaFiles.id, {
    onDelete: 'set null',
  }),
  jobRole: userJobRoleEnum('job_role').notNull(),
  techStacks: jsonb('tech_stacks').$type<string[]>(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  handleUpdatedAt: timestamp('handle_updated_at', { withTimezone: true }).defaultNow(),
} satisfies UserProfileSchema);

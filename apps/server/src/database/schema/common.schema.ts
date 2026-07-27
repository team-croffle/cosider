import { EFileContextType, EFileVisibility, EPriority, IMediaFile } from '@cosider/shared';
import { bigint, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { assertSchemaMatch, type AssertSchema } from '../type-utils';

import { users } from './user.schema';

export const priorityEnum = pgEnum(
  'priority_enum',
  Object.values(EPriority) as [EPriority, ...EPriority[]],
);

// ############### MEDIA FILES ###############

type MediaFileSchema = Record<keyof IMediaFile, unknown>;

export const fileVisibilityEnum = pgEnum(
  'file_visibility_enum',
  Object.values(EFileVisibility) as [EFileVisibility, ...EFileVisibility[]],
);

export const fileContextTypeEnum = pgEnum(
  'file_context_type_enum',
  Object.values(EFileContextType) as [EFileContextType, ...EFileContextType[]],
);

export const mediaFiles = pgTable('media_files', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  bucketName: varchar('bucket_name', { length: 50 }).notNull(),
  objectKey: text('object_key').notNull().unique(),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  // 이 파일을 직접적으로 reference하는 대상의 id
  contextId: uuid('context_id').notNull(),
  // nullable: user avatar등은 워크스페이스나 프로젝트에 속하지 않을 수 있음
  workspaceId: uuid('workspace_id'),
  projectId: uuid('project_id'),
  visibility: fileVisibilityEnum('visibility').notNull(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
} satisfies MediaFileSchema);

assertSchemaMatch<AssertSchema<typeof mediaFiles.$inferSelect, IMediaFile>>();

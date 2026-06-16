import { EFileRefType, EFileVisibility, EPriority, IMediaFile } from '@cosider/shared';
import { bigint, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

export const priorityEnum = pgEnum(
  'priority_enum',
  Object.values(EPriority) as [string, ...string[]],
);

// ############### MEDIA FILES ###############

type MediaFileSchema = Record<keyof IMediaFile, unknown>;

export const fileVisibilityEnum = pgEnum(
  'file_visibility_enum',
  Object.values(EFileVisibility) as [string, ...string[]],
);

export const fileRefTypeEnum = pgEnum(
  'file_ref_type_enum',
  Object.values(EFileRefType) as [string, ...string[]],
);

export const mediaFiles = pgTable('media_files', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  bucketName: varchar('bucket_name', { length: 50 }).notNull(),
  objectKey: text('object_key').notNull(),
  originalName: text('original_name').notNull().unique(),
  mimeType: text('mime_type').notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  visibility: fileVisibilityEnum('visibility').notNull(),
  refType: fileRefTypeEnum('ref_type').notNull(),
  refId: uuid('ref_id').notNull(),
  ownerId: uuid('owner_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
} satisfies MediaFileSchema);

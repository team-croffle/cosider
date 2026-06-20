import { EFileRefType, EFileVisibility, EPriority, IMediaFile } from '@cosider/shared';
import { bigint, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

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

export const fileRefTypeEnum = pgEnum(
  'file_ref_type_enum',
  Object.values(EFileRefType) as [EFileRefType, ...EFileRefType[]],
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
  visibility: fileVisibilityEnum('visibility').notNull(),
  refType: fileRefTypeEnum('ref_type').notNull(),
  refId: uuid('ref_id').notNull(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
} satisfies MediaFileSchema);

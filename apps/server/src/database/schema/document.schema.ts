import {
  EContentType,
  EDocumentType,
  EMappedEntityType,
  ESourceType,
  IDocument,
  IDocumentHistory,
  IWhiteboardObject,
} from '@cosider/shared';
import { sql } from 'drizzle-orm';
import { customType, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { projects } from './project.schema';
import { users } from './user.schema';

// Bytea type definition for Drizzle
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return 'bytea';
  },
});

// ############### DOCUMENTS ###############
type DocumentSchema = Record<keyof IDocument, unknown>;

export const documentTypeEnum = pgEnum(
  'document_type',
  Object.values(EDocumentType) as [EDocumentType, ...EDocumentType[]],
);

export const contentTypeEnum = pgEnum(
  'content_type',
  Object.values(EContentType) as [EContentType, ...EContentType[]],
);

export const sourceTypeEnum = pgEnum(
  'source_type',
  Object.values(ESourceType) as [ESourceType, ...ESourceType[]],
);

export const documents = pgTable('documents', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  projectId: uuid('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'set null' }),
  authorNickname: varchar('author_nickname', { length: 100 }),
  title: varchar('title', { length: 200 }).notNull(),
  documentType: documentTypeEnum('document_type').notNull(),
  contentType: contentTypeEnum('content_type').notNull(),
  sourceType: sourceTypeEnum('source_type').notNull(),
  content: bytea('content'),
  contentVector: bytea('content_vector').default(sql`'\\x'::bytea`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
} satisfies DocumentSchema);

// ############### DOCUMENT HISTORIES ###############
type DocumentHistorySchema = Record<keyof IDocumentHistory, unknown>;

export const documentHistories = pgTable('document_histories', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  documentId: uuid('document_id')
    .references(() => documents.id, { onDelete: 'cascade' })
    .notNull(),
  content: bytea('content').notNull(),
  versionTag: varchar('version_tag', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
} satisfies DocumentHistorySchema);

// ############### WHITEBOARD OBJECTS ###############
type WhiteboardObjectSchema = Record<keyof IWhiteboardObject, unknown>;

export const mappedEntityTypeEnum = pgEnum(
  'mapped_entity_type',
  Object.values(EMappedEntityType) as [EMappedEntityType, ...EMappedEntityType[]],
);

export const whiteboardObjects = pgTable('whiteboard_objects', {
  id: uuid('entity_id') // ER uses entity_id for PK
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  whiteboardDocId: uuid('whiteboard_doc_id')
    .references(() => documents.id, { onDelete: 'cascade' })
    .notNull(),
  objectId: varchar('object_id', { length: 255 }).notNull(),
  mappedEntityType: mappedEntityTypeEnum('mapped_entity_type'),
  mappedEntityId: uuid('mapped_entity_id'),
} satisfies WhiteboardObjectSchema);

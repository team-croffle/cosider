import { ERequirementBlockType, ERequirementStatus, IRequirement } from '@cosider/shared';
import { index, pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { documents } from './document.schema';
import { projects } from './project.schema';

// ############### REQUIREMENTS ###############
type RequirementSchema = Record<keyof (IRequirement & { requirementCode: string }), unknown>;

export const requirementTypeEnum = pgEnum(
  'requirement_type',
  Object.values(ERequirementBlockType) as [string, ...string[]],
);

export const requirementStatusEnum = pgEnum(
  'requirement_status',
  Object.values(ERequirementStatus) as [string, ...string[]],
);

export const requirements = pgTable(
  'requirements',
  {
    id: uuid('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    documentId: uuid('document_id')
      .references(() => documents.id, { onDelete: 'cascade' })
      .notNull(),
    type: requirementTypeEnum('type').notNull(),
    requirementCode: varchar('requirement_code', { length: 50 }).notNull(),
    contentText: text('content_text'),
    contentHash: varchar('content_hash', { length: 64 }).notNull(),
    status: requirementStatusEnum('status').default(ERequirementStatus.DRAFT).notNull(),
  } satisfies RequirementSchema,
  (t) => [index('project_requirement_code_idx').on(t.projectId, t.requirementCode)],
);

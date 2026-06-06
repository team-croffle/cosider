import { IApiSpecification } from '@cosider/shared';
import { index, jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { projects } from './project.schema';
import { requirements } from './requirement.schema';

// ############### API SPECIFICATIONS ###############
type ApiSpecificationSchema = Record<keyof IApiSpecification, unknown>;

export const apiSpecifications = pgTable(
  'api_specifications',
  {
    id: uuid('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    method: varchar('method', { length: 10 }).notNull(),
    endpointPath: varchar('endpoint_path', { length: 255 }).notNull(),
    summary: varchar('summary', { length: 255 }),
    requestSchema: jsonb('request_schema'),
    responseSchema: jsonb('response_schema'),
  } satisfies ApiSpecificationSchema,
  (t) => [index('project_method_endpoint_idx').on(t.projectId, t.method, t.endpointPath)],
);

// ############### API REQUIREMENT LINKS ###############
export const apiRequirementLinks = pgTable('api_requirement_links', {
  apiId: uuid('api_id')
    .references(() => apiSpecifications.id, { onDelete: 'cascade' })
    .notNull(),
  requirementId: uuid('requirement_id')
    .references(() => requirements.id, { onDelete: 'cascade' })
    .notNull(),
  syncStatus: varchar('sync_status', { length: 20 }).default('UPDATED'),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }).defaultNow(),
});

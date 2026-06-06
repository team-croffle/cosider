import { ISdlcTemplate } from '@cosider/shared';
import { boolean, jsonb, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

// ############### SDLC TEMPLATES ###############
type SdlcTemplateSchema = Record<keyof ISdlcTemplate, unknown>;

export const sdlcTemplates = pgTable('sdlc_templates', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  sdlcType: varchar('sdlc_type', { length: 20 }).notNull().unique(),
  phases: jsonb('phases').notNull(),
} satisfies SdlcTemplateSchema);

// ############### CHECKLIST TEMPLATES ###############
export const checklistTemplates = pgTable('checklist_templates', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  sdlcType: varchar('sdlc_type', { length: 20 }).notNull(),
  stageName: varchar('stage_name', { length: 100 }).notNull(),
  taskName: varchar('task_name', { length: 200 }).notNull(),
  isRequired: boolean('is_required').default(true).notNull(),
});

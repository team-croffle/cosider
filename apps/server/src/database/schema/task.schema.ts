import {
  ETaskStatus,
  IRequirementTaskLink,
  ITask,
  ITaskAttachment,
  ITaskDependency,
} from '@cosider/shared';
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { priorityEnum } from './common.schema';
import { documents } from './document.schema';
import { projects, sprints } from './project.schema';
import { requirements } from './requirement.schema';
import { users } from './user.schema';

// ############### TASKS ###############
type TaskSchema = Record<keyof ITask, unknown>;

export const taskStatusEnum = pgEnum(
  'task_status',
  Object.values(ETaskStatus) as [string, ...string[]],
);

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    taskNumber: integer('task_number').notNull(),
    assigneeId: uuid('assignee_id').references(() => users.id, { onDelete: 'set null' }),
    assigneeNickname: varchar('assignee_nickname', { length: 100 }),
    reporterId: uuid('reporter_id').references(() => users.id, { onDelete: 'set null' }),
    reporterNickname: varchar('reporter_nickname', { length: 100 }),
    linkedDocumentId: uuid('linked_document_id').references(() => documents.id, {
      onDelete: 'set null',
    }),
    sprintId: uuid('sprint_id').references(() => sprints.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    status: taskStatusEnum('status').default(ETaskStatus.TODO).notNull(),
    priority: priorityEnum('priority').notNull(),
    startDate: timestamp('start_date', { withTimezone: true }),
    dueDate: timestamp('due_date', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  } satisfies TaskSchema,
  (t) => [uniqueIndex('project_task_number_uidx').on(t.projectId, t.taskNumber)],
);

// ############### REQUIREMENT TASK LINKS ###############
// ER: 18. REQUIREMENT_TASK_LINKS
type RequirementTaskLinkSchema = Record<keyof IRequirementTaskLink, unknown>;

export const requirementTaskLinks = pgTable(
  'requirement_task_links',
  {
    requirementId: uuid('requirement_id')
      .references(() => requirements.id, { onDelete: 'cascade' })
      .notNull(),
    taskId: uuid('task_id')
      .references(() => tasks.id, { onDelete: 'cascade' })
      .notNull(),
  } satisfies RequirementTaskLinkSchema,
  (t) => [primaryKey({ columns: [t.requirementId, t.taskId] })],
);

// ############### TASK DEPENDENCIES ###############
type TaskDependencySchema = Record<keyof ITaskDependency, unknown>;

export const taskDependencies = pgTable(
  'task_dependencies',
  {
    id: uuid('id')
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    taskId: uuid('task_id')
      .references(() => tasks.id, { onDelete: 'cascade' })
      .notNull(),
    predecessorTaskId: uuid('predecessor_task_id')
      .references(() => tasks.id, { onDelete: 'cascade' })
      .notNull(),
  } satisfies TaskDependencySchema,
  (t) => [uniqueIndex('task_dependency_uidx').on(t.taskId, t.predecessorTaskId)],
);

// ############### TASK ATTACHMENTS ###############
type TaskAttachmentSchema = Record<keyof ITaskAttachment, unknown>;

export const taskAttachments = pgTable('task_attachments', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  taskId: uuid('task_id')
    .references(() => tasks.id, { onDelete: 'cascade' })
    .notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  // S3에서 Key로 접근해서 NestJS가 PresignedURL로 변환해서 제공
  fileId: uuid('file_id').notNull(),
  size: integer('size'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
} satisfies TaskAttachmentSchema);

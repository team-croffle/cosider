import { IGitCommit } from '@cosider/shared';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

import { tasks } from './task.schema';

// ############### GIT COMMITS ###############
type GitCommitSchema = Record<keyof IGitCommit, unknown>;

export const gitCommits = pgTable('git_commits', {
  id: uuid('id')
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  taskId: uuid('task_id')
    .references(() => tasks.id, { onDelete: 'cascade' })
    .notNull(),
  commitHash: varchar('commit_hash', { length: 40 }).notNull(),
  message: text('message'),
  author: varchar('author', { length: 100 }),
  url: text('url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
} satisfies GitCommitSchema);

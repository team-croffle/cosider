import { EPriority } from '@cosider/shared';
import { pgEnum } from 'drizzle-orm/pg-core';

export const priorityEnum = pgEnum(
  'priority_enum',
  Object.values(EPriority) as [string, ...string[]],
);

import { EPriority, ETaskStatus } from '@cosider/shared';
import { z } from 'zod';

const TaskParticipantSchema = z.object({
  id: z.string(),
  email: z.string(),
  handle: z.string(),
  nickname: z.string().nullable(),
  profileImageId: z.string().nullable(),
  updatedAt: z.string(),
  handleUpdatedAt: z.string(),
});

export const TaskResponseSchema = z.object({
  id: z.string(),
  taskNumber: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  sprintId: z.string().nullable(),
  linkedDocumentIds: z.array(z.string()).nullable(),
  linkedRequirementIds: z.array(z.string()).nullable(),
  status: z.enum(Object.values(ETaskStatus) as [string, ...string[]]).nullable(),
  priority: z.enum(Object.values(EPriority) as [string, ...string[]]).nullable(),
  startDate: z.string().nullable(),
  dueDate: z.string().nullable(),
  attachments: z.array(z.unknown()).nullable(),
  assignee: TaskParticipantSchema.nullable(),
  reporter: TaskParticipantSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TaskListSchema = z.array(TaskResponseSchema);

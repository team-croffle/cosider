import { EPriority } from '../../common';

import { ETaskStatus } from './task.enum';

export interface Task {
  id: string;
  projectId: string;
  taskNumber: number;
  assigneeId: string | null;
  assigneeNickname: string | null;
  reporterId: string | null;
  reporterNickname: string | null;
  linkedDocumentId: string | null;
  sprintId: string | null;
  title: string;
  description: string | null;
  status: ETaskStatus;
  priority: EPriority;
  startDate: Date | null;
  dueDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  predecessorTaskId: string;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  size: number;
  createdAt: Date;
}

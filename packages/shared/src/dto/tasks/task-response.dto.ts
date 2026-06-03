import { EPriority } from '../common/priority.enum';

import { ETaskStatus } from './enums/task-status.enum';

export class TaskResponseDto {
  id!: string;
  task_number!: number;
  title!: string;
  description?: string;
  assignee_handle?: string;
  sprint_id?: string;
  linked_document_ids?: string[];
  linked_requirement_ids?: string[];
  status!: ETaskStatus;
  priority?: EPriority;
  start_date?: string;
  due_date?: string;
  assignee_nickname!: string;
  reporter_nickname!: string;
  created_at!: string;
  updated_at!: string;
}

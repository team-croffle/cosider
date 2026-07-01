import { EPriority, ETaskStatus, ITaskResponse } from '@cosider/shared';

export class TaskResponseDto implements ITaskResponse {
  id!: string;
  taskNumber!: number;
  title!: string;
  description?: string;
  assigneeHandle?: string;
  sprintId?: string;
  linkedDocumentId?: string;
  linkedRequirementIds?: string[];
  status!: ETaskStatus;
  priority?: EPriority;
  startDate?: string;
  dueDate?: string;
  assigneeNickname!: string;
  reporterNickname!: string;
  createdAt!: string;
  updatedAt!: string;
}

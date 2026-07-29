import { EPriority, ETaskStatus, ITaskResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class TaskResponseDto implements ITaskResponse {
  @Expose()
  id!: string;

  @Expose()
  taskNumber!: number;

  @Expose()
  title!: string;

  @Expose()
  description: string | null = null;

  @Expose()
  sprintId: string | null = null;

  @Expose()
  linkedDocumentIds: string[] | null = null;

  @Expose()
  linkedRequirementIds: string[] | null = null;

  @Expose()
  status!: ETaskStatus;

  @Expose()
  priority: EPriority | null = null;

  @Expose()
  startDate: string | null = null;

  @Expose()
  dueDate: string | null = null;

  @Expose()
  attachments: ITaskResponse['attachments'] | null = null;

  @Expose()
  assignee: ITaskResponse['assignee'] | null = null;

  @Expose()
  reporter: ITaskResponse['reporter'] | null = null;

  @Expose()
  createdAt!: string;

  @Expose()
  updatedAt!: string;

  constructor(data?: Partial<TaskResponseDto>) {
    Object.assign(this, data);
  }
}

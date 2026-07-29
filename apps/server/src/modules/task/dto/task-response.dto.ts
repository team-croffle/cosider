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
  description!: string | null;

  @Expose()
  sprintId!: string | null;

  @Expose()
  linkedDocumentIds!: string[] | null;

  @Expose()
  linkedRequirementIds!: string[] | null;

  @Expose()
  status!: ETaskStatus | null;

  @Expose()
  priority!: EPriority | null;

  @Expose()
  startDate!: string | null;

  @Expose()
  dueDate!: string | null;

  @Expose()
  attachments!: ITaskResponse['attachments'] | null;

  @Expose()
  assignee!: ITaskResponse['assignee'] | null;

  @Expose()
  reporter!: ITaskResponse['reporter'];

  @Expose()
  createdAt!: string;

  @Expose()
  updatedAt!: string;

  constructor(data?: Partial<TaskResponseDto>) {
    Object.assign(this, data);
  }
}

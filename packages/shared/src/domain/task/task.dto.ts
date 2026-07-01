import { EPriority } from '../../common';

import { ITask } from './task.interface';

export interface ICreateNewTaskRequest {
  title: ITask['title'];
  status: ITask['status'];

  description?: string;
  assigneeHandle?: string;
  sprintId?: string;
  linkedDocumentId?: string;
  linkedRequirementIds?: string[];
  priority?: EPriority;
  startDate?: string;
  dueDate?: string;
}

export type IUpdateTaskRequest = Partial<ICreateNewTaskRequest>;

export interface ITaskResponse {
  id: string;
  taskNumber: number;
  title: string;
  description?: string;
  assigneeHandle?: string;
  sprintId?: string;
  linkedDocumentId?: string;
  linkedRequirementIds?: string[];
  status: ITask['status'];
  priority?: EPriority;
  startDate?: string;
  dueDate?: string;
  assigneeNickname: string;
  reporterNickname: string;
  createdAt: string;
  updatedAt: string;
}

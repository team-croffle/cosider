import { EPriority } from '../../common';
import { IDocument } from '../document';
import { IProject, ISprint } from '../project';
import { IUser, IUserProfile } from '../user';

import { ETaskStatus } from './task.enum';

export interface ITask {
  id: string;
  projectId: IProject['id'];
  taskNumber: number;
  assigneeId: IUser['id'] | null;
  assigneeNickname: IUserProfile['nickname'] | null;
  reporterId: IUser['id'] | null;
  reporterNickname: IUserProfile['nickname'] | null;
  linkedDocumentId: IDocument['id'] | null;
  sprintId: ISprint['id'] | null;
  title: string;
  description: string | null;
  status: ETaskStatus;
  priority: EPriority;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ITaskDependency {
  id: string;
  taskId: ITask['id'];
  predecessorTaskId: ITask['id'];
}

export interface ITaskAttachment {
  id: string;
  taskId: ITask['id'];
  // ID를 통해 NestJS가 PresignedURL로 Redirect해서 제공
  fileId: string;
  createdAt: string;
}

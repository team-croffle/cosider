import { EPriority, IFileMetadata } from '../../common';
import { IUser, IUserProfile } from '../user';

import { ITask } from './task.interface';

export type ITaskParticipantResponse = Pick<IUser, 'id' | 'email'> &
  Pick<IUserProfile, 'handle' | 'nickname' | 'profileImageId'> & {
    updatedAt: string;
    handleUpdatedAt: string;
  };

export interface ITaskResponse {
  id: string;
  taskNumber: number;
  title: string;
  description: string | null;
  sprintId: string | null;
  linkedDocumentIds: string[] | null;
  linkedRequirementIds: string[] | null;
  status: ITask['status'];
  priority: EPriority | null;
  startDate: string | null;
  dueDate: string | null;
  attachments: IFileMetadata[] | null;
  assignee: ITaskParticipantResponse | null;
  reporter: ITaskParticipantResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateNewTaskRequest
  extends
    Pick<ITask, 'title' | 'status'>,
    Partial<Pick<ITask, 'description' | 'sprintId' | 'linkedDocumentId' | 'priority'>> {
  assigneeHandle?: string;
  linkedRequirementIds?: string[];
  startDate?: string;
  dueDate?: string;
}

export type IUpdateTaskRequest = Partial<ICreateNewTaskRequest>;

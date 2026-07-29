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
  status: ITask['status'] | null;
  priority: EPriority | null;
  startDate: string | null;
  dueDate: string | null;
  attachments: IFileMetadata[] | null;
  assignee: ITaskParticipantResponse | null;
  reporter: ITaskParticipantResponse;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateNewTaskRequest
  extends
    Pick<ITask, 'title'>,
    Partial<Pick<ITask, 'description' | 'sprintId' | 'linkedDocumentId'>> {
  assigneeHandle?: string | null;
  linkedRequirementIds?: string[] | null;
  status?: ITask['status'] | null;
  priority?: EPriority | null;
  startDate?: string | null;
  dueDate?: string | null;
}

export type IUpdateTaskRequest = Partial<ICreateNewTaskRequest>;

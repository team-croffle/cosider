import { ITask, IFileMetadata } from '@cosider/shared';

export type DBTaskRowFromITask = Omit<
  ITask,
  'startDate' | 'dueDate' | 'createdAt' | 'updatedAt'
> & {
  startDate: Date | null;
  dueDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type TaskParticipantRow = {
  id: string;
  email: string;
  handle: string;
  nickname: string | null;
  profileImageId: string | null;
  updatedAt: Date | null;
  handleUpdatedAt: Date | null;
};

export type TaskAttachmentRow = {
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  visibility: IFileMetadata['visibility'];
  createdAt: Date | null;
};

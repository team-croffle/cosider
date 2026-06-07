import { ITask } from '../task';

export interface IGitCommit {
  id: string;
  taskId: ITask['id'];
  commitHash: string;
  message: string;
  author: string;
  url: string | null;
  createdAt: string;
}

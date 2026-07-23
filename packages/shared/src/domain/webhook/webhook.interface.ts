import { ITask } from '../task';

/** DB 테이블 계약. timestamptz 컬럼은 Date. */
export interface IGitCommit {
  id: string;
  taskId: ITask['id'];
  commitHash: string;
  message: string;
  author: string;
  url: string;
  createdAt: Date;
}

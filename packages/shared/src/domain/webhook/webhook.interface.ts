export interface IGitCommit {
  id: string;
  taskId: string;
  commitHash: string;
  message: string;
  author: string;
  url: string | null;
  createdAt: string;
}

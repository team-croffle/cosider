export interface IRestoreCofirmRequest {
  token: string;
}

export interface IRestoreConfirmResponse {
  userId: string;
  email: string;
  handle: string;
  nickname: string;
}

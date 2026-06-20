import { IRestoreConfirmResponse } from '@cosider/shared';

export class RestoreConfirmResponse implements IRestoreConfirmResponse {
  userId!: string;
  email!: string;
  handle!: string;
  nickname!: string;
}

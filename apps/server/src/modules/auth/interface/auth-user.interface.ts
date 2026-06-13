import { IAuthUser } from '@cosider/shared';

export interface IAuth extends IAuthUser {
  userId: string;
  email: string;
}

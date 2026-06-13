import { IJwtPayload } from '@cosider/shared';
export interface IPayload extends IJwtPayload {
  userId: string;
  email: string;
}

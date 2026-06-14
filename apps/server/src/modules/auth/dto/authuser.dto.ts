import { IAuthUser } from '../interface/auth-user.interface';

export class AuthUser implements IAuthUser {
  userId!: string;
  email!: string;
}

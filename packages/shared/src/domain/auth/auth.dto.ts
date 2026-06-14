import { EJobRole } from '../user';

export interface IAuthorize {
  email: string;
  password: string;
}

export interface IEmailVerifyRequest {
  token: string;
}

export interface ISignupRequest extends IAuthorize {
  passwordConfirm: string;
  handle: string;
  jobRole: EJobRole;
}

export interface IUserAuthResponse {
  userId: string;
  email: string;
}

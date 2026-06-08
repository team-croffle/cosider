import { IUserProfile } from './user.interface';

export interface ICheckHandleExistsResponse {
  isAvailable: boolean;
}

export interface IDeactivateRequest {
  password: string;
}

export interface IDeactivateResponse {
  message: string;
}

export interface IRestoreRequest extends Pick<IUserProfile, 'email'> {
  code: string;
}

export interface IRestoreResponse {
  message: string;
}

export interface IUserProfileResponse extends Pick<
  IUserProfile,
  'handle' | 'nickname' | 'techStacks' | 'jobRole'
> {
  profileImageUrl: string | null;
}

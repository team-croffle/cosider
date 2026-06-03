import { IUserProfiles } from './user.interface';

export interface ICheckHandleExistsResponse {
  isAvailable: boolean;
}

export interface IDeactivateRequest {
  password: string;
}

export interface IDeactivateResponse {
  message: string;
}

export interface IRestoreRequest extends Pick<IUserProfiles, 'email'> {
  code: string;
}

export interface IRestoreResponse {
  message: string;
}

export type IUserProfileResponse = Pick<
  IUserProfiles,
  'handle' | 'nickname' | 'profileImageUrl' | 'techStacks' | 'jobRole'
>;

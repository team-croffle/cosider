import { IFileUploadCompletionRequest } from '../../common';

import { IUser, IUserProfile } from './user.interface';

// 설계에 맞춰 변경함.

// User Profiles
export type IUserProfileResponse = Pick<
  IUserProfile,
  'handle' | 'nickname' | 'techStacks' | 'jobRole' | 'profileImageId'
>;

export type ICreateUserProfileRequest = Omit<
  IUserProfile,
  'id' | 'userId' | 'profileImageId' | 'createdAt' | 'updatedAt' | 'handleUpdatedAt'
> &
  Pick<IFileUploadCompletionRequest, 'uploadToken'>;

export type IUserProfileUpdateRequest = Partial<
  Pick<IUserProfile, 'nickname' | 'techStacks' | 'jobRole'>
>;

export type IUserProfileDetailResponse = Pick<IUser, 'email'> &
  Pick<IUserProfile, 'handle' | 'nickname' | 'profileImageId' | 'techStacks' | 'jobRole'> & {
    updatedAt: string | null;
    handleUpdatedAt: string | null;
  };

// User Accounts
export type IUserAccountResponse = Pick<IUser, 'email'> &
  Pick<IUserProfile, 'handle' | 'profileImageId'> & {
    updatedAt: string | null;
    handleUpdatedAt: string | null;
  };

export type IUserHandleUpdateRequest = Partial<Pick<IUserProfile, 'handle'>>;

export interface IAccountDeleteAcceptedResponse {
  userId: string;
  status: IUser['status'];
  deletedAt: string | null;
  recoveryDeadline: string;
  permanentDeletionAt: string;
}

export interface IPasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface IAccountDeleteRequest {
  password: string;
}

export type IAuthUserResponse = Pick<
  IUserProfile,
  'handle' | 'nickname' | 'profileImageId' | 'jobRole'
>;

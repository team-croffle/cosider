import { IUser, IUserProfile } from './user.interface';

// 설계에 맞춰 변경함.

// User Profiles
export type IUserProfileResponse = Pick<
  IUserProfile,
  'handle' | 'nickname' | 'techStacks' | 'jobRole' | 'profileImageId'
>;

export type IUserProfileUpdateRequest = Partial<
  Pick<IUserProfile, 'nickname' | 'techStacks' | 'jobRole'>
>;

export type IUserProfileDetailResponse = Pick<IUser, 'email'> &
  Pick<
    IUserProfile,
    | 'handle'
    | 'nickname'
    | 'profileImageId'
    | 'techStacks'
    | 'jobRole'
    | 'updatedAt'
    | 'handleUpdatedAt'
  >;

// User Accounts
export type IUserAccountResponse = Pick<IUser, 'email'> &
  Pick<IUserProfile, 'handle' | 'profileImageId' | 'updatedAt' | 'handleUpdatedAt'>;

export type IUserHandleUpdateRequest = Partial<Pick<IUserProfile, 'handle'>>;

export interface IAccountDeleteAcceptedResponse extends Pick<IUser, 'status' | 'deletedAt'> {
  userId: string;
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

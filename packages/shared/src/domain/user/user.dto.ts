import { IUser, IUserProfile } from './user.interface';

export interface ICheckHandleExistsResponse {
  isAvailable: boolean;
}

export interface IDeactivateRequest {
  password: string;
}

export interface IDeactivateResponse {
  message: string;
}

// 스키마 변경에 따른 DTO 타입 조정
export interface IRestoreRequest extends Pick<IUser, 'email'> {
  code: string;
}

export interface IRestoreResponse {
  message: string;
}

// 스키마 변경에 따른 DTO 타입 조정
export interface IUserProfileResponse
  extends
    Pick<IUserProfile, 'handle' | 'nickname' | 'techStacks' | 'jobRole'>,
    Pick<IUser, 'email'> {
  // ID를 통해 NestJS가 PresignedURL로 Redirect해서 제공
  profileImageId: string | null;
}

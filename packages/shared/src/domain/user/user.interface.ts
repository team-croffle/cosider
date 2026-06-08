import { EJobRole, EUserCredentialProvider, EUserStatus } from './user.enum';

export interface IUser {
  id: string;
  status: EUserStatus;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface IUserCredential {
  id: string;
  userId: IUser['id'];
  provider: EUserCredentialProvider;
  providerId: string;
  credential: string | null;
  lastLogin: string | null;
}

export interface IUserBackupCode {
  id: string;
  userId: IUser['id'];
  codeHash: string;
  usedAt: string | null;
}

export interface IUserProfile {
  id: string;
  userId: IUser['id'];
  handle: string;
  email: string;
  nickname: string;
  // Key로 접근해서 NestJS가 PresignedURL로 변환해서 제공
  profileImageKey: string | null;
  jobRole: EJobRole;
  techStacks: string[] | null;
  updatedAt: string | null;
  nicknameUpdatedAt: string | null;
}

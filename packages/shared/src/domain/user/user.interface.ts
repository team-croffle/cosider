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
  profileImageUrl: string | null;
  jobRole: EJobRole;
  techStacks: string[] | null;
  updatedAt: string | null;
  nicknameUpdatedAt: string | null;
}

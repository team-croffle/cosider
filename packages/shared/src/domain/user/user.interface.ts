import { EJobRole, EUserCredentialProvider, EUserStatus } from './user.enum';

export interface IUser {
  id: string;
  status: EUserStatus;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  createdAt: string;
  deletedAt: string;
}

export interface IUserCredential {
  id: string;
  userId: string;
  provider: EUserCredentialProvider;
  providerId: string;
  credential: string | null;
  lastLogin: Date | null;
}

export interface IUserBackupCode {
  id: string;
  userId: string;
  codeHash: string;
  usedAt: string | null;
}

export interface IUserProfile {
  id: string;
  userId: string;
  handle: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  jobRole: EJobRole;
  techStacks: string[] | null;
  updatedAt: string | null;
  nicknameUpdatedAt: string | null;
}

import { EUserCredentialProvider, EUserJobRole, EUserStatus } from './user.enum';

export interface IUsers {
  id: string;
  status: EUserStatus;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  createdAt: string;
  deletedAt: string;
}

export interface IUserCredentials {
  id: string;
  userId: string;
  provider: EUserCredentialProvider;
  providerId: string;
  credential: string | null;
  lastLogin: string | null;
}

export interface IUserBackupCode {
  id: string;
  userId: string;
  codeHash: string;
  usedAt: string | null;
}

export interface IUserProfiles {
  id: string;
  userId: string;
  handle: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  jobRole: EUserJobRole;
  techStacks: string[] | null;
  updatedAt: string | null;
  nicknameUpdatedAt: string | null;
}

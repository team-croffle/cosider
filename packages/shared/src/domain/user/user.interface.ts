import { EJobRole, EUserCredentialProvider, EUserStatus } from './user.enum';

/** DB 테이블 계약. timestamptz 컬럼은 Date. */
export interface IUser {
  id: string;
  // email 조회를 위해 스키마 변경
  email: string;
  status: EUserStatus;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  createdAt: Date | null;
  deletedAt: Date | null;
}

export interface IUserCredential {
  id: string;
  userId: IUser['id'] | null;
  provider: EUserCredentialProvider;
  providerId: string;
  credential: string;
  lastLogin: Date | null;
}

export interface IUserBackupCode {
  id: string;
  userId: IUser['id'] | null;
  codeHash: string;
  usedAt: Date | null;
}

export interface IUserProfile {
  id: string;
  userId: IUser['id'] | null;
  handle: string;
  nickname: string | null;
  // ID를 통해 NestJS가 PresignedURL로 Redirect해서 제공
  profileImageId: string | null;
  jobRole: EJobRole;
  techStacks: string[] | null;
  updatedAt: Date | null;
  handleUpdatedAt: Date | null;
}

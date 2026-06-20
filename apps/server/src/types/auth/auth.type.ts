import { EJobRole, EUserCredentialProvider, EUserStatus } from '@cosider/shared';

export interface GeneratedAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface AuthenticatedUser {
  userId: string;
  status: EUserStatus;
  twoFactorEnabled: boolean;
  email: string;
  handle: string;
  nickname: string | null;
  jobRole: EJobRole;
}

export interface ExistingProviders {
  userId: string;
  status: EUserStatus;
  providers: EUserCredentialProvider[];
}

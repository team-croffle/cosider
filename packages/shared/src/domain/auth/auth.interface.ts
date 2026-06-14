export interface IRefreshToken {
  id: string; //uuid
  userId: string; // uuid
  tokenValue: string; // uuid, cookieOnly
  expiresAt: string; // timestamptz
  createdAt: string; // timestamptz
  revokedAt: string; // timestamptz
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

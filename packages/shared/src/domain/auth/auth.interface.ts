export interface RefreshTokens {
  id: string; //uuid
  userId: string; // uuid
  tokenValue: string; // uuid, cookieOnly
  expiresAt: string; // timestamptz
  createdAt: string; // timestamptz
  revokedAt: string; // timestamptz
}

export interface TokenPairs {
  accessToken: string;
  refreshToken: string;
}

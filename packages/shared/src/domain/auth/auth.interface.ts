export interface IRefreshToken {
  id: string; //uuid
  userId: string | null; // uuid
  tokenValue: string; // text, cookieOnly
  expiresAt: Date; // timestamptz
  createdAt: Date | null; // timestamptz
  revokedAt: Date | null; // timestamptz
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

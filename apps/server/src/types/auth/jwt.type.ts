export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export interface JwtUserPayload {
  userId: string;
}

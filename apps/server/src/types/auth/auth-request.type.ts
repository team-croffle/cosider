import { Request } from 'express';

import { AuthenticatedUser } from './auth.type';
import { JwtUserPayload } from './jwt.type';

import { AuthorizeDto } from '@/modules/auth/dto';

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
  cookies: {
    accessToken?: string;
    refreshToken?: string;
    [key: string]: unknown;
  };
}

export interface LocalAuthRequest extends Request {
  body: AuthorizeDto;
  user?: AuthenticatedUser;
}

export interface RefreshRequest extends Request {
  cookies: {
    refreshToken?: string;
    [key: string]: unknown;
  };
  refreshToken?: string;
}

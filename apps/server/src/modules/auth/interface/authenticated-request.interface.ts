import { IJwtPayload } from '@cosider/shared';
import { Request } from 'express';

export interface IAuthenticatedRequest extends Request {
  user: IJwtPayload;
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
}

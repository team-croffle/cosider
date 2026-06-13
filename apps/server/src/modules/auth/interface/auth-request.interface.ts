import { Request } from 'express';

import { IPayload } from './jwtpayload.interface';

export interface IAuthenticatedRequest extends Request {
  user: IPayload;
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user: { userId: string; email: string };
  cookies: { accessToken: string; refreshToken: string };
}

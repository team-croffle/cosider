import {
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

import { RefreshRequest } from '@/types/auth';

export const ExtractRefreshToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<RefreshRequest>();
    if (!req.refreshToken) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'INVALID_TOKEN',
        message: 'ERR_INVALID_TOKEN',
      });
    }
    return req.refreshToken;
  },
);

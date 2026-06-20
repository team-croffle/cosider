import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { RefreshRequest } from '@/types/auth/auth-request.type';

@Injectable()
export class RefreshGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<RefreshRequest>();
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'MISSING_REFRESH_TOKEN',
        message: 'ERR_MISSING_REFRESH_TOKEN',
      });
    }

    req.refreshToken = refreshToken;
    return true;
  }
}

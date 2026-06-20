import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserCredentialService } from '../user-credential.service';

import { LocalAuthRequest } from '@/types/auth/auth-request.type';
import { AuthenticatedUser } from '@/types/auth/auth.type';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private userCredentialService: UserCredentialService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // Request Body에서 인증 정보 추출
    const req = ctx.switchToHttp().getRequest<LocalAuthRequest>();
    const { email, password } = req.body;

    // 인증 정보 검증
    const user = await this.userCredentialService.verifyLocalCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'INVALID_CREDENTIALS',
        message: 'ERR_INVALID_CREDENTIALS',
      });
    }

    req.user = user as unknown as AuthenticatedUser;
    return true;
  }
}

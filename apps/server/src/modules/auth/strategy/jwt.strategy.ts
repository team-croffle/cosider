import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { AuthRequest } from '../interface/auth-user.interface';
import { IJwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: AuthRequest) => {
          return req?.cookies?.accessToken ?? null;
        },
      ]),
      ignoreExpiration: false,
      // Todo: JWT_SECRET 분리
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: AuthRequest, payload: IJwtPayload): Promise<IJwtPayload> {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const isValid = await this.authService.validateAccessToken(payload.userId, accessToken);

    if (!isValid) {
      throw new UnauthorizedException('다중기기 로그인 미허용');
    }

    return payload;
  }
}

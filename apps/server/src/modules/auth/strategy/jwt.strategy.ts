import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { AuthRequest, JwtPayload, JwtUserPayload } from '@/types/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: AuthRequest) => {
          return req.cookies.accessToken ?? null;
        },
      ]),
      ignoreExpiration: false,
      // Todo: JWT_SECRET 분리
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(payload: JwtPayload): JwtUserPayload {
    return { userId: payload.sub };
  }
}

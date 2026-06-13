import { createHash } from 'crypto';

import { IJwtPayload } from '@cosider/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IAuthenticatedRequest } from '../interface/authenticated-request.interface';

import { RedisService } from '@/common/redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: IAuthenticatedRequest): string | null => {
          return req?.cookies?.accessToken ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(req: IAuthenticatedRequest, payload: IJwtPayload): Promise<IJwtPayload> {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    const accessTokenHash = createHash('sha256').update(accessToken).digest('hex');

    const storedTokenHash = await this.redisService.get(`access-token:${payload.userId}`);

    if (!storedTokenHash) {
      throw new UnauthorizedException('Session expired');
    }

    if (storedTokenHash !== accessTokenHash) {
      throw new UnauthorizedException('Invalid session');
    }

    return payload;
  }
}

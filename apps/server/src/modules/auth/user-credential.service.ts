import { EUserCredentialProvider, EUserStatus } from '@cosider/shared';
import {
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { and, eq } from 'drizzle-orm';

import { DB_CONNECTION } from '@/common/constants';
import type { DrizzleDB } from '@/database/drizzle.module';
import { userCredentials, userProfiles, users } from '@/database/schema';

@Injectable()
export class UserCredentialService {
  constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}

  public async verifyLocalCredentials(email: string, password: string): Promise<unknown> {
    const [record] = await this.db
      .select({
        userId: users.id,
        status: users.status,
        twoFactorEnabled: users.twoFactorEnabled,
        email: userProfiles.email,
        passwordHash: userCredentials.credential,
        nickname: userProfiles.nickname,
        handle: userProfiles.handle,
        jobRole: userProfiles.jobRole,
      })
      .from(users)
      .innerJoin(userProfiles, eq(users.id, userProfiles.userId))
      .innerJoin(userCredentials, eq(users.id, userCredentials.userId))
      // local 인증에서 providerId는 email 이다. 추가적으로 provider는 local이다.
      .where(
        and(
          eq(userCredentials.provider, EUserCredentialProvider.LOCAL),
          eq(userCredentials.providerId, email),
        ),
      )
      .limit(1);

    // 유저가 없는 경우
    if (!record) {
      return null;
    }
    // password 검증
    // password 검증을 먼저 하는 이유: Timing Attack 방어와 비즈니스 로직상 더 적절하기 때문.
    // status를 먼저 검증하는 경우, 유저가 없는 경우와 password를 틀린 경우 미세한 응답시간 차이가 발생할 수 있음.
    // 또한, 비밀번호가 틀렸는데도 status를 검증하는 경우 계정이 존재하는지를 짐작하게 만들 수 있음.
    const isValid = await argon2.verify(record.passwordHash, password);
    if (!isValid) {
      return null;
    }

    // status 검증
    if (record.status === EUserStatus.BANNED) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: EUserStatus.BANNED,
        message: 'ERR_BANNED_ACCOUNT',
      });
    } else if (record.status === EUserStatus.INACTIVE) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: EUserStatus.INACTIVE,
        message: 'ERR_INACTIVE_ACCOUNT',
      });
    } else if (record.status === EUserStatus.PENDING) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: EUserStatus.PENDING,
        message: 'ERR_PENDING_ACCOUNT',
      });
    } else if (record.status === EUserStatus.PENDING_LEAVE) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: EUserStatus.PENDING_LEAVE,
        message: 'ERR_PENDING_LEAVE_ACCOUNT',
      });
    } else if (record.status === EUserStatus.LEAVED) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: EUserStatus.LEAVED,
        message: 'ERR_LEAVED_ACCOUNT',
      });
    }

    return {
      userId: record.userId,
      status: record.status,
      twoFactorEnabled: record.twoFactorEnabled,
      email: record.email,
      handle: record.handle,
      nickname: record.nickname,
      jobRole: record.jobRole,
    };
  }
}

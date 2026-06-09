import { EJobRole, EUserCredentialProvider, EUserStatus } from '@cosider/shared';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';

import { EmailVerifyRequest, SignupRequest } from './dto';

import { DB_CONNECTION, type DrizzleDB } from '@/database/drizzle.module';
import { userCredentials, userProfiles, users } from '@/database/schema';

@Injectable()
export class AuthService {
  constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}

  // #12-signup-email-users
  async signup(dto: SignupRequest): Promise<void> {
    const { email, password, passwordConfirm } = dto;

    if (password !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    this.validatePassword(password);

    // 이메일 중복 체크 (user_profiles.email에 unique 제약이 있음)
    const existing = await this.db.select().from(userProfiles).where(eq(userProfiles.email, email));
    if (existing.length > 0) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const hashed = await this.hashPassword(password);

    // 트랜잭션으로 users, user_credentials, user_profiles 동시 생성
    await this.db.transaction(async (tx) => {
      const userId = uuidv7();

      await tx.insert(users).values({ id: userId, status: EUserStatus.PENDING });

      await tx.insert(userCredentials).values({
        id: uuidv7(),
        userId,
        provider: EUserCredentialProvider.LOCAL,
        providerId: email,
        credential: hashed,
      });

      // handle 생성 정책: 이메일 앞부분을 기본으로 사용합니다.
      // 충돌 처리(중복 handle)는 별도 로직으로 처리 필요 — 여기서는 간단하게 사용합니다.
      const handle = email.split('@')[0];

      await tx.insert(userProfiles).values({
        id: uuidv7(),
        userId,
        email,
        handle,
        jobRole: EJobRole.FE_DEV, // 기본값으로 FE_DEV 지정. 필요 시 클라이언트에서 선택하도록 변경하세요.
      });
    });

    // TODO:
    // - 이메일 인증용 JWT 발급 (payload: { userId, email }, expiresIn: 5m)
    // - 인증 링크 생성 (FRONTEND_URL 환경변수 사용)
    // - Email Service 연동 후 인증 메일 발송
  }

  //TODO
  //:이메일 인증용 JWT 검증
  //JWT payload 기반 사용자 활성화 처리
  async verifyEmail(_: EmailVerifyRequest): Promise<void> {
    // const { token } = dto;
    //TODO: JwtService.verifyAsync(token)
    // payload 예시
    // {
    //   userId: string;
    //   email: string;
    // }
    //TODO: payload.userId 기준 사용자 조회
    // user check
    // if (!user) {
    //   throw new BadRequestException('존재하지 않는 사용자입니다.');
    // }
    // 이미 인증된 사용자 검증
    // if (user.status === EUserStatus.ACTIVE) {
    //   throw new BadRequestException('이미 인증된 사용자입니다.');
    // }
    // activate user
    // user.status = EUserStatus.ACTIVE;
  }

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private validatePassword(password: string): void {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d`!@#$%^&*]{8,20}$/;
    if (!regex.test(password)) {
      throw new BadRequestException('비밀번호는 8~20자, 영문, 숫자를 포함해야 합니다.');
    }
  }
}

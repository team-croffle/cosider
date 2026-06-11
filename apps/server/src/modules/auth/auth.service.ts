import { EUserCredentialProvider, EUserStatus } from '@cosider/shared';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';

import { EmailVerifyRequest, SignupRequest } from './dto';

import { DB_CONNECTION, type DrizzleDB } from '@/database/drizzle.module';
import { userCredentials, userProfiles, users } from '@/database/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupRequest): Promise<void> {
    const { email, password, passwordConfirm, handle, jobRole } = dto;

    if (password !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    this.validatePassword(password);

    const existing = await this.db.select().from(userProfiles).where(eq(userProfiles.email, email));
    if (existing.length > 0) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }
    const existingHandle = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.handle, handle));
    if (existingHandle.length > 0) {
      throw new BadRequestException('이미 사용중인 이름입니다.');
    }

    const hashed = await this.hashPassword(password);

    // email verify token 생성
    const userId = uuidv7();
    const token = await this.jwtService.signAsync({ userId, email }, { expiresIn: '5m' });

    await this.db.transaction(async (tx) => {
      await tx.insert(users).values({ id: userId, status: EUserStatus.PENDING });

      await tx.insert(userProfiles).values({
        id: uuidv7(),
        userId,
        email,
        handle,
        jobRole,
      });

      await tx.insert(userCredentials).values({
        id: uuidv7(),
        userId,
        provider: EUserCredentialProvider.LOCAL,
        providerId: email,
        credential: hashed,
      });

      // email Verify Link 생성
      const verifyLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
      // 이메일 서비스 연동 후 인증메일 발송 로직으로 대체
      console.log(verifyLink);
    });
  }

  async verifyEmail(dto: EmailVerifyRequest): Promise<void> {
    const { token } = dto;

    let payload: { userId: string; email: string };

    try {
      payload = await this.jwtService.verifyAsync<{
        userId: string;
        email: string;
      }>(token);
    } catch {
      throw new BadRequestException('유효하지 않은 인증 토큰입니다.');
    }

    const [user] = await this.db.select().from(users).where(eq(users.id, payload.userId));

    if (!user) throw new BadRequestException('존재하지 않는 사용자입니다.');
    if (user.status === 'ACTIVE') throw new BadRequestException('이미 인증된 사용자입니다.');
    if (user.status !== 'PENDING') throw new BadRequestException('인증 가능한 상태가 아닙니다.');

    await this.db
      .update(users)
      .set({
        status: 'ACTIVE',
      })
      .where(eq(users.id, payload.userId));
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

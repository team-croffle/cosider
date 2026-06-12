import { EUserCredentialProvider, EUserStatus } from '@cosider/shared';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';

import { EmailVerifyRequest, SignupRequest } from './dto';
import { JwtPayload } from './interface/jwt-payload.interface';

import { DB_CONNECTION, type DrizzleDB } from '@/database/drizzle.module';
import { userCredentials, userProfiles, users } from '@/database/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
  ) {}
  // expiresIn은 필요시 변경 예정.
  // AccessToken과 RefreshToken의 secret또한 필요시 분리/변경 예정
  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '5m' });
  }
  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }
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

    await this.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          status: EUserStatus.PENDING,
        })
        .returning({ id: users.id });
      // email verify token 생성
      const token = await this.jwtService.signAsync(
        {
          userId: user.id,
          email,
        },
        { expiresIn: '5m' },
      );

      await tx.insert(userProfiles).values({
        userId: user.id,
        email,
        handle,
        jobRole,
      });

      await tx.insert(userCredentials).values({
        userId: user.id,
        provider: EUserCredentialProvider.LOCAL,
        providerId: email,
        credential: hashed,
      });

      const verifyLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;

      console.log(verifyLink);
    });
  }

  async verifyEmail(dto: EmailVerifyRequest): Promise<void> {
    const { token } = dto;

    type EmailVerifyPayload = {
      userId: string;
      email: string;
    };

    let payload: EmailVerifyPayload;

    try {
      payload = await this.jwtService.verifyAsync<EmailVerifyPayload>(token);
    } catch {
      throw new BadRequestException('유효하지 않은 인증 토큰입니다.');
    }

    const [user] = await this.db.select().from(users).where(eq(users.id, payload.userId)).limit(1);

    if (!user) throw new BadRequestException('존재하지 않는 사용자입니다.');
    // Drizzle과 EUserStatus 타입 불일치 오류로 하드코딩. 추후 개선 예정
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

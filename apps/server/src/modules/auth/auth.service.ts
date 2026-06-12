import { createHash, randomBytes } from 'crypto';

import { EUserCredentialProvider, EUserStatus } from '@cosider/shared';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import Redis from 'ioredis';

import { EmailVerifyRequest, SigninDto, SignupRequest } from './dto';
import { IAuthUser } from './interface/authuser.interface';

import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { DB_CONNECTION, type DrizzleDB } from '@/database/drizzle.module';
import { refreshTokens, userCredentials, userProfiles, users } from '@/database/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}
  // expiresIn은 필요시 변경 예정.
  // AccessToken과 RefreshToken의 secret또한 필요시 분리/변경 예정
  private async generateAccessToken(user: IAuthUser): Promise<string> {
    return this.jwtService.signAsync({ sub: user.userId }, { expiresIn: '5m' });
  }
  private generateRefreshToken() {
    return randomBytes(32).toString('hex');
  }

  private async storeAccessToken(userId: string, token: string) {
    await this.redis.set(`access:${userId}`, token, 'EX', 5 * 60);
  }
  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    await this.db.insert(refreshTokens).values({
      userId: userId,
      tokenValue: hashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  async validateUser(dto: SigninDto): Promise<IAuthUser> {
    const result = await this.db
      .select({
        userId: users.id,
        email: userProfiles.email,
        password: userCredentials.credential,
      })
      .from(userProfiles)
      .innerJoin(users, eq(users.id, userProfiles.userId))
      .innerJoin(userCredentials, eq(userCredentials.userId, users.id))
      .where(eq(userProfiles.email, dto.email))
      .limit(1);
    if (!result.length) throw new UnauthorizedException('Invalid credentials');

    const user = result[0];

    const isValid = await argon2.verify(user.password, dto.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return {
      userId: user.userId,
      email: user.email,
    };
  }

  async signin(user: IAuthUser): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    await this.storeAccessToken(user.userId, accessToken);
    await this.storeRefreshToken(user.userId, refreshToken);
    return { accessToken, refreshToken }; // 임시 (cookie 붙이면 제거 가능)
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

      console.log(verifyLink); // 이메일 서비스 미연결 임시 대체라인
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

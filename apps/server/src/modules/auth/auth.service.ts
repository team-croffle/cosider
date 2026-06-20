import { createHash, randomUUID } from 'crypto';

import { EUserStatus } from '@cosider/shared';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { and, eq, isNull } from 'drizzle-orm';
import type { Redis } from 'ioredis';

import { EmailVerifyRequest } from './dto';
import { UserCredentialService } from './user-credential.service';

import { DB_CONNECTION, REDIS_CLIENT } from '@/common/constants';
import { type DrizzleDB } from '@/database/drizzle.module';
import { refreshTokens, users } from '@/database/schema';
import type { GeneratedAuthTokens, JwtUserPayload } from '@/types/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(DB_CONNECTION) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
    private readonly userCredentialService: UserCredentialService,
  ) {}

  // 토큰 생성
  // 함수 변경 이유: accessToken과 refreshToken을 같이 생성하여 반환할 필요가 있음.
  public async generateAuthTokens({ userId }: JwtUserPayload): Promise<GeneratedAuthTokens> {
    // Access Token은 JWT로 생성
    const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '15m' });

    // Refresh Token은 Opaque UUID로 생성
    // uuidv7은 시간 기반임. 또한 DB의 PK 정렬을 위함.
    // 그래서 C++ Core 레벨의 crypto.randomUUID()를 통해 빠르고 오버헤드가 없으며, 예측 불가능한 랜덤 토큰을 사용.
    const refreshToken = randomUUID();

    // refresh Token은 sha256으로 hashing. DB Leak시 랜덤값 노출 방지.
    const tokenValue = this.hashToken(refreshToken);

    // 만료기한 7일
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    // refresh token은 db에 insert 해야함.
    // TODO: 향후 group-key를 토큰마다 부여함.
    // 그룹키를 쓰면, 하나의 기기에 대해 token을 관리할 수 있고, 탈취 시 해당 group-key를 가진 토큰만 invalid 처리하면 된다.
    // 하지만 현재는 그런 기능이 없으므로 userId 기준으로 토큰을 관리함.
    await this.db.insert(refreshTokens).values({
      userId,
      tokenValue,
      expiresAt,
    });

    // Controller에서 쿠키 설정과 함께 클라이언트에게 전달됨.
    return {
      accessToken,
      refreshToken,
      expiresAt,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // Redis에 Access Token이 저장되는 함수는 제거.
  // 사유: Access Token은 Stateless인 JWT이므로, 서명(signature)만으로 검증이 가능함.
  // 탈취 시 Access Token의 만료는 Redis를 통해 Blacklist로 관리함.

  public async refreshTokens(refreshToken: string): Promise<GeneratedAuthTokens> {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    const [record] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenValue, tokenHash))
      .limit(1);

    if (!record) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'INVALID_TOKEN',
        message: 'ERR_INVALID_TOKEN',
      });
    }

    if (new Date() > record.expiresAt) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'EXPIRED_TOKEN',
        message: 'ERR_EXPIRED_TOKEN',
      });
    }

    if (record.revokedAt !== null) {
      await this.revokeAllTokensByUserId(record.userId!);
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'REVOKED_TOKEN',
        message: 'ERR_REVOKED_TOKEN',
      });
    }

    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, record.id));

    return this.generateAuthTokens({ userId: record.userId! });
  }

  public async revokeToken(refreshToken: string): Promise<void> {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    const [record] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenValue, tokenHash))
      .limit(1);

    if (!record) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'INVALID_TOKEN',
        message: 'ERR_INVALID_TOKEN',
      });
    }

    if (new Date() > record.expiresAt) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'EXPIRED_TOKEN',
        message: 'ERR_EXPIRED_TOKEN',
      });
    }

    if (record.revokedAt !== null) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'ALREADY_REVOKED',
        message: 'ERR_ALREADY_REVOKED',
      });
    }

    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, record.id));
  }

  public async revokeAllTokensByUserId(userId: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  }

  // validateUser는 분리 (Single Responsibility Principle)

  // async signup(dto: SignupRequest): Promise<void> {
  //   const { email, password, passwordConfirm } = dto;

  //   if (password !== passwordConfirm) {
  //     throw new BadRequestException('비밀번호가 일치하지 않습니다.');
  //   }

  //   const isPasswordValid = isStrongPassword(password, {
  //     minLength: 8,
  //     minLowercase: 1,
  //     minNumbers: 1,
  //     minSymbols: 1,
  //   });
  //   if (!isPasswordValid) {
  //     throw new BadRequestException('비밀번호는 8자 이상, 영문, 숫자를 포함해야 합니다.');
  //   }

  //   const existing = await this.userCredentialService.findExistingProvidersByEmail(email);
  //   if (existing) {
  //     if (existing.status === EUserStatus.ACTIVE) {
  //       throw new BadRequestException('이미 존재하는 이메일입니다.');
  //     }
  //   }
  // }

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
    // Todo: Drizzle과 EUserStatus 타입 불일치 오류로 하드코딩. 추후 개선
    if (user.status === EUserStatus.ACTIVE)
      throw new BadRequestException('이미 인증된 사용자입니다.');
    if (user.status !== EUserStatus.PENDING)
      throw new BadRequestException('인증 가능한 상태가 아닙니다.');

    await this.db
      .update(users)
      .set({
        status: EUserStatus.ACTIVE,
      })
      .where(eq(users.id, payload.userId));
  }

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private validatePassword(password: string): void {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d`!@#$%^&*]{8}$/;
    if (!regex.test(password)) {
      throw new BadRequestException('비밀번호는 8자 이상, 영문, 숫자를 포함해야 합니다.');
    }
  }
}

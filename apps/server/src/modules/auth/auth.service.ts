import { createHash, randomBytes, randomUUID } from 'crypto';

import { EUserCredentialProvider } from '@cosider/shared';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { isStrongPassword } from 'class-validator';
import { and, eq, isNull } from 'drizzle-orm';
import type { Redis } from 'ioredis';

import { EmailVerifyRequest } from './dto';
import { SignupRequest } from './dto/signup-request.dto';
import { UserCredentialService } from './user-credential.service';

import {
  DB_CONNECTION,
  MAIL_VERIFY_PURPOSE,
  REDIS_CLIENT,
  REDIS_KEY_REGISTER_PENDING,
} from '@/common/constants';
import { MailService } from '@/common/mail/mail.service';
import { type DrizzleDB } from '@/database/drizzle.module';
import { refreshTokens, userCredentials, users } from '@/database/schema';
import type { JwtMailVerifyPayload, GeneratedAuthTokens, JwtUserPayload } from '@/types/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(DB_CONNECTION) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
    private readonly userCredentialService: UserCredentialService,
    private readonly mailService: MailService,
  ) {}

  // 토큰 생성
  // 함수 변경 이유: accessToken과 refreshToken을 같이 생성하여 반환할 필요가 있음.
  public async generateAuthTokens({ userId }: JwtUserPayload): Promise<GeneratedAuthTokens> {
    // Access Token은 JWT로 생성
    const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '15m' });

    // Refresh Token은 Opaque UUID로 생성
    // uuidv7은 시간 기반임. 또한 DB의 PK 정렬을 위함.
    // 그래서 C++ Core 레벨의 crypto.randomUUID()를 통해 빠르고 오버헤드가 없으며, 예측 불가능한 랜덤 토큰을 사용.
    const refreshToken = randomBytes(32).toString('hex');

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

  private async getValidRefreshTokenRecord(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);

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

    return record;
  }

  private async markTokenAsRevoked(tokenId: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, tokenId));
  }

  public async refreshTokens(refreshToken: string): Promise<GeneratedAuthTokens> {
    const record = await this.getValidRefreshTokenRecord(refreshToken);
    if (record.revokedAt !== null) {
      await this.revokeAllTokensByUserId(record.userId!);
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'REVOKED_TOKEN',
        message: 'ERR_REVOKED_TOKEN',
      });
    }

    await this.markTokenAsRevoked(record.id);

    return this.generateAuthTokens({ userId: record.userId! });
  }

  public async revokeToken(refreshToken: string): Promise<void> {
    const record = await this.getValidRefreshTokenRecord(refreshToken);

    if (record.revokedAt !== null) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: 'ALREADY_REVOKED',
        message: 'ERR_ALREADY_REVOKED',
      });
    }

    await this.markTokenAsRevoked(record.id);
  }

  public async revokeAllTokensByUserId(userId: string): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  }

  // validateUser는 분리 (Single Responsibility Principle)

  async signupLocal(dto: SignupRequest): Promise<void> {
    const { email, password, passwordConfirm } = dto;

    if (password !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const isPasswordValid = isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
    if (!isPasswordValid) {
      throw new BadRequestException('비밀번호는 8자 이상, 영문, 숫자를 포함해야 합니다.');
    }

    const existing = await this.userCredentialService.findExistingProvidersByEmail(email);
    if (existing) {
      if (existing.providers.includes(EUserCredentialProvider.LOCAL)) {
        // 이미 존재하는 계정이며, LOCAL provider가 존재.
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          errorCode: 'ACCOUNT_ALREADY_EXISTS',
          message: 'ERR_ACCOUNT_ALREADY_EXISTS',
        });
      } else {
        // 연동 로직: LOCAL(Email/PW) 계정은 없지만, 다른 OAuth 계정이 이미 존재.
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          errorCode: 'REQUIRE_SOCIAL_LINKING',
          message: 'ERR_REQUIRE_SOCIAL_LINKING',
          meta: {
            userId: existing.userId,
            // 사용자가 선택할 수 있는 provider 항목
            providers: existing.providers,
          },
        });
      }
    }

    // 존재하는 계정이 없으니 새로 생성. 단, redis에 임시 유저 생성하고 이메일 인증 성공 시 db에 insert 진행.
    // email을 redis key로 사용하기 위해 randomByte 대신 jwt를 사용
    const verificationToken = this.jwtService.sign<JwtMailVerifyPayload>(
      {
        email,
        purpose: MAIL_VERIFY_PURPOSE,
      },
      {
        expiresIn: '1h',
        // 토큰 자체를 랜덤하게 하기 위해 토큰에 id 추가.
        jwtid: randomUUID(),
      },
    );

    // redis에 적재
    // !!변경: email 사용:
    // => token을 쓰면, 만약 누군가가 회원가입 요청 후 미인증으로 10번을 반복하면, redis에 10개의 토큰이 적재됨.
    // => email을 쓰면, 동일한 email에 대해 10번의 덮어쓰기만 발생하여 redis 사용량이 줄어듦.
    const redisKey = `${REDIS_KEY_REGISTER_PENDING}:${email}`;
    await this.redis.hset(redisKey, {
      email: email,
      password: password,
      token: verificationToken,
    });

    // 유효시간 1시간.
    await this.redis.expire(redisKey, 60 * 60 * 1);

    // 메일링 Service를 추가하여 verificationToken을 이메일로 발송
    await this.mailService.sendVerificationMail(email, verificationToken);
  }

  async verifyEmail(dto: EmailVerifyRequest): Promise<void> {
    let payload: JwtMailVerifyPayload;

    try {
      payload = this.jwtService.verify<JwtMailVerifyPayload>(dto.token);
    } catch {
      // verify는 token이 유효하지 않거나 만료되었을 경우 throw.
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 'INVALID_TOKEN',
        message: 'ERR_INVALID_TOKEN',
      });
    }

    if (payload.purpose !== MAIL_VERIFY_PURPOSE) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 'INVALID_TOKEN',
        message: 'ERR_INVALID_TOKEN',
      });
    }

    const redisKey = `${REDIS_KEY_REGISTER_PENDING}:${payload.email}`;
    const pendingUser = await this.redis.hgetall(redisKey);

    if (!pendingUser || Object.keys(pendingUser).length === 0) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 'INVALID_EMAIL',
        message: 'ERR_INVALID_EMAIL',
      });
    }

    const { email, password, token: storedToken } = pendingUser;
    if (dto.token !== storedToken) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 'INVALID_TOKEN',
        message: 'ERR_INVALID_TOKEN',
      });
    }

    const existing = await this.userCredentialService.findExistingProvidersByEmail(email);
    if (existing) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 'ALREADY_REGISTERED',
        message: 'ERR_ALREADY_REGISTERED',
      });
    }

    // 트랜잭션으로 user, user_credential 동시 insert 진행.
    await this.db.transaction(async (tx) => {
      // 들어갈 Value는 email 밖에 없음.
      // Why? -> id는 자동 생성, status는 default(PENDING), createdAt은 defaultNow()
      // Pendingd이면 로그인 후 Profile을 입력받아야 함.
      const [user] = await tx.insert(users).values({ email }).returning();

      const cryptedPassword = await argon2.hash(password);
      await tx.insert(userCredentials).values({
        userId: user.id,
        provider: EUserCredentialProvider.LOCAL,
        providerId: email,
        credential: cryptedPassword,
      });
    });

    // 완료되었으므로 redis에서 삭제.
    await this.redis.del(redisKey);
  }
}

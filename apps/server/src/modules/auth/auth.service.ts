import * as crypto from 'crypto';

import { EUserStatus, SignupRequestDto, VerifyEmailRequestDto } from '@cosider/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

// import { DB_CONNECTION, type DrizzleDB } from '@/database/drizzle.module';

type MockUser = {
  id: string;
  email: string;
  password: string;
  status: EUserStatus;
  created_at: string;
};

@Injectable()
export class AuthService {
  private users: MockUser[] = [];
  // #12-signup-email-users
  async signup(dto: SignupRequestDto): Promise<void> {
    const { email, password, passwordConfirm } = dto;

    //password Confirm
    if (password !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    //password Validation
    this.validatePassword(password);

    //email Duplicate Check
    const exists = this.users.find((u) => u.email === email);
    if (exists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    //user Create. 초기 status는 Pending으로 설정. 이메일 인증시 Active 처리.
    const user: MockUser = {
      id: crypto.randomUUID(),
      email,
      password: await this.hashPassword(password),
      status: EUserStatus.PENDING,
      created_at: new Date().toISOString(),
    };

    this.users.push(user);

    //TODO:
    // 이메일 인증용 JWT 발급
    // payload:
    // {
    //   userId: user.id,
    //   email: user.email,
    // }
    // expiresIn: 5m

    //TODO:
    // 인증 링크 생성(ENV에 Frontend url 작성.)
    // const verifyLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
    // Email Service 연동 후 인증 메일 발송
    // MockUser 저장 -> Drizzle users 테이블 저장
  }

  //TODO
  //:이메일 인증용 JWT 검증
  //JWT payload 기반 사용자 활성화 처리
  async verifyEmail(dto: VerifyEmailRequestDto): Promise<void> {
    const { token } = dto;

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

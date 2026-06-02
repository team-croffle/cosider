import {
  SignupRequestDto,
  SignupResponseDto,
  VerifyEmailRequestDto,
  VerifyEmailResponseDto,
} from '@cosider/shared';
import { Injectable } from '@nestjs/common';
// import { DB_CONNECTION, type DrizzleDB } from '@/database/drizzle.module';

@Injectable()
export class AuthService {
  // constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}
  async signup(dto: SignupRequestDto): Promise<SignupResponseDto> {
    const { email, password, passwordConfirm } = dto;
    //TODO: 비밀번호 정책 정의
    if (password !== passwordConfirm) {
      //TODO: 비밀번호 미일치 예외처리
      // throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    //TODO: 이메일 중복 검사
    //TODO: 비밀번호 해싱

    //TODO: 인증코드 생성 방식 정의
    // const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    //TODO: Redis 저장
    //TODO: 이메일 발송
    return {
      message: '회원가입이 완료되었습니다. 이메일 인증을 진행해주세요.',
    };
  }

  async verifyEmail(dto: VerifyEmailRequestDto): Promise<VerifyEmailResponseDto> {
    const { email, code } = dto;

    //TODO: Redis 조회
    //TODO: 만료 검증
    //TODO: 코드 검증
    //TODO: User ACTIVE 변경
    return {
      message: '이메일 인증이 완료되었습니다.',
    };
  }
}

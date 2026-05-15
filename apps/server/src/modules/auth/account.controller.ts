import {
  SignupRequestDto,
  SignupResponseDto,
  VerifyEmailRequestDto,
  VerifyEmailResponseDto,
} from '@cosider/shared';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AccountService } from './account.service';

@ApiTags('Auth')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Signup', description: 'Create new account' })
  @ApiResponse({
    status: 200,
    type: SignupResponseDto,
    description: '성공',
  })
  @ApiResponse({
    description: '이메일 인증 수행 안함',
  })
  @ApiResponse({
    status: 403,
    description: '이메일 인증 미완료 상태로 재가입 시도 (2분 미경과)',
  })
  @ApiResponse({
    status: 201,
    description: '이메일 인증 미완료 상태로 재가입 시도 (2분 경과 / 재가입 허용)',
  })
  @ApiResponse({
    status: 409,
    description: '중복된 이메일',
  })
  signup(@Body() signupDto: SignupRequestDto): SignupResponseDto {
    console.log(signupDto);
    return {
      message: '가입이 완료되었습니다',
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Email', description: 'Verify email to use signup.' })
  @ApiResponse({
    status: 200,
    type: VerifyEmailResponseDto,
    description: '이메일 인증 성공',
  })
  @ApiResponse({
    status: 400,
    description: '이메일 인증 실패.',
  })
  @ApiResponse({
    status: 403,
    description: '인증 미완료 상태로 재가입 시도 (2분 미경과)',
  })
  @ApiResponse({
    status: 410,
    description: '인증코드 만료 (5분 초과)',
  })
  verifyEmail(@Body() verifyEmail: VerifyEmailRequestDto): VerifyEmailResponseDto {
    console.log(verifyEmail);
    return {
      message: '이메일 인증이 완료되었습니다.',
    };
  }
}

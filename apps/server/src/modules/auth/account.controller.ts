import { SignupRequestDto, SignupResponseDto } from '@cosider/shared';
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
      message: '이메일 인증 완료',
    };
  }
}

import {
  DeactiveReqeustDto,
  DeactiveResponseDto,
  RestoreRequestDto,
  RestoreResponseDto,
  SignupRequestDto,
  SignupResponseDto,
  VerifyEmailRequestDto,
  VerifyEmailResponseDto,
} from '@cosider/shared';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AccountService } from './account.service';

@ApiTags('Auth')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Signup',
    description: '계정 생성 및 이메일 인증 코드 발송',
  })
  @ApiResponse({
    status: 201,
    type: SignupResponseDto,
    description: '가입 성공',
  })
  @ApiResponse({
    description: '이메일 인증 수행 안함',
  })
  @ApiResponse({
    status: 403,
    description: '이메일 인증 미완료 상태로 재가입 시도 (2분 미경과)',
  })
  @ApiResponse({
    status: 409,
    description: '이미 사용중인 이메일(중복 이메일)',
  })
  signup(@Body() signupDto: SignupRequestDto): SignupResponseDto {
    console.log(signupDto);
    return {
      message: '가입이 완료되었습니다',
    };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify Email',
    description: '인증코드 검증',
  })
  @ApiResponse({
    status: 200,
    type: VerifyEmailResponseDto,
    description: '이메일 인증 성공',
  })
  @ApiResponse({
    status: 201,
    description: '이메일 인증 미완료 상태로 재가입 시도 (2분 경과 / 재가입 허용)',
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

  @ApiBearerAuth()
  @Post('deactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate account',
    description: '계정 soft delete 수행 및 모든 세션 만료',
  })
  @ApiResponse({
    status: 200,
    type: DeactiveResponseDto,
    description: '계정이 삭제됨.',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  @ApiResponse({
    status: 409,
    description: '사용자의 명으로 남은 프로젝트가 존재함.',
  })
  deactivate(@Body() deactive: DeactiveReqeustDto): DeactiveResponseDto {
    console.log(deactive);
    return {
      message: '계정 삭제가 완료 되었습니다.',
    };
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '계정 복구',
    description: '이메일 인증을 통해 탈퇴된 계정을 복구합니다.',
  })
  @ApiResponse({
    status: 200,
    type: RestoreResponseDto,
    description: '계정 복구 성공',
  })
  @ApiResponse({
    status: 400,
    description: '인증 코드 불일치',
  })
  @ApiResponse({
    status: 403,
    description: '복구 가능 기간 (탈퇴 후 1개월) 초과 ',
  })
  @ApiResponse({
    status: 404,
    description: '탈퇴된 계정을 찾을 수 없음',
  })
  @ApiResponse({
    status: 410,
    description: '인증 코드 만료',
  })
  restore(@Body() restoreDto: RestoreRequestDto): RestoreResponseDto {
    console.log(restoreDto);
    return {
      message: '계정이 복구되었습니다.',
    };
  }
}

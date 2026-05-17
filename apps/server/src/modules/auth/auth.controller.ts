import {
  LoginResponseDto,
  OAuthResponseDto,
  SignupRequestDto,
  SignupResponseDto,
  VerifyEmailRequestDto,
  VerifyEmailResponseDto,
} from '@cosider/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
// import { OAuthGuard } from '../guards/oauth.guard';
// import { SigninGuard} from '../guards/signin.guard;
// import { LogoutGuard} from '../guards/logout.guard;
// import { RefreshGuard } from '../guards/refresh.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(SigninGuard)
  @ApiOperation({
    summary: 'Login',
    description: 'Access/Refresh Token 발급',
  })
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 400,
    description: 'Email 형식이 잘못되었거나, 비밀번호가 너무 짧음',
  })
  @ApiResponse({
    status: 401,
    description: '가입되지 않은 이메일 또는 잘못된 PW',
  })
  @ApiResponse({
    status: 403,
    description: '토큰 탈취 및 사용 불가능한 계정 상태',
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
  })
  signin(@Req() req: Request): LoginResponseDto {
    console.log(req);
    return {
      accessToken: 'token',
      expiresIn: 1000,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(LogoutGuard)
  @ApiOperation({
    summary: 'Logout',
    description: '쿠키 만료 및 refreshToken 삭제',
  })
  @ApiResponse({
    status: 204,
    description: '로그아웃 성공',
  })
  //Promise<void>
  logout(@Req() req: Request): void {
    console.log(req);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Signup',
    description: '계정 생성 및 이메일 인증 코드 발송',
  })
  @ApiResponse({
    status: 201,
    type: SignupResponseDto,
    description:
      '가입 성공 or 이메일 인증 미완료 상태에서 2분 경과 후 재가입 시도 시 기존 데이터 삭제 후 재가입 허용',
  })
  @ApiResponse({
    description: '이메일 인증 수행 안함',
  })
  @ApiResponse({
    status: 400,
    description: '이메일 형식 오류 또는 비밀번호 형식 오류',
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
  // provider 추후에 수정해야함.
  @Get('oauth/:provider')
  // @UseGuards(OAuthGuard)
  @ApiOperation({
    summary: 'OAuth Login',
    description: 'OAuth 제공자 인증 페이지로 리다이렉트. provider은 추후 수정 예정.',
  })
  oauthLogin() {}

  @Get('oauth/:provider/callback')
  // @UseGuards(OAuthGuard)
  @ApiOperation({
    summary: 'OAuth 콜백',
    description: '신규면 가입, 기존이면 로그인 처리 후 토큰 발급. provider은 추후 수정 예정',
  })
  @ApiResponse({ status: 200, type: OAuthResponseDto, description: '로그인 성공' })
  @ApiResponse({ status: 201, type: OAuthResponseDto, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: 'OAuth 인증 실패' })
  oauthCallback(@Req() req: Request): OAuthResponseDto {
    console.log(req);
    return {
      accessToken: 'token',
      expiresIn: 1000,
      isNewUser: true,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(RefreshGuard)
  @ApiOperation({
    summary: 'refresh Token',
    description: 'Refresh Token으로 Access Token을 재발급. (RTR)',
  })
  @ApiResponse({ status: 200, type: LoginResponseDto, description: '토큰 재발급 성공' })
  @ApiResponse({ status: 401, description: 'Refresh Token 없음/만료' })
  @ApiResponse({ status: 403, description: '토큰 탈취 감지, 모든 세션 만료' })
  refresh(@Req() req: Request): LoginResponseDto {
    console.log(req);
    return {
      accessToken: 'token',
      expiresIn: 1000,
    };
  }
}

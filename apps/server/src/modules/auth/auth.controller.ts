import {
  LoginRequestDto,
  LoginResponseDto,
  LogoutResponseDto,
  OAuthResponseDto,
} from '@cosider/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
// import { OAuthGuard } from './guards/oauth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
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
  signIn(@Body() loginDto: LoginRequestDto): LoginResponseDto {
    console.log(loginDto);
    return {
      accessToken: 'token',
      expiresIn: 1000,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout',
    description: '쿠키 만료 및 refreshToken 삭제',
  })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
  })
  logout(@Req() req: Request): LogoutResponseDto {
    console.log(req);
    return {
      message: '로그아웃이 완료되었습니다',
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
  oauthCallback(@Req() _req: Request): OAuthResponseDto {
    return {
      accessToken: 'token',
      expiresIn: 1000,
      isNewUser: true,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'refresh Token',
    description: 'Refresh Token으로 Access Token을 재발급. (RTR)',
  })
  @ApiResponse({ status: 200, type: LoginResponseDto, description: '토큰 재발급 성공' })
  @ApiResponse({ status: 401, description: 'Refresh Token 없음/만료' })
  @ApiResponse({ status: 403, description: '토큰 탈취 감지, 모든 세션 만료' })
  refresh(@Req() _req: Request): LoginResponseDto {
    return {
      accessToken: 'token',
      expiresIn: 1000,
    };
  }
}

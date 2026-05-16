import { LoginRequestDto, LoginResponseDto, LogoutResponseDto } from '@cosider/shared';
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

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
      refreshToken: 'refreshToken',
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

  // OAuth 로그인 및 회원가입 관련: 방식 어떻게?
}

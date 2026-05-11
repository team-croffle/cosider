import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login', description: 'Access/Refresh Token 발급' })
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
    description: '로그인 성공',
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async signIn(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    console.log(loginDto);

    return {
      accessToken: 'token',
      refreshToken: 'refreshToken',
      expiresIn: 1000,
    };
  }
}

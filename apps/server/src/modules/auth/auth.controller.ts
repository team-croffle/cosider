import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { EmailVerifyRequest, Signin, SignupRequest } from './dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import type { AuthRequest } from './interface/auth-user.interface';
// import { OAuthGuard } from '../guards/oauth.guard';
// import { LogoutGuard} from '../guards/logout.guard;
// import { RefreshGuard } from '../guards/refresh.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  async signin(@Body() dto: Signin, @Res({ passthrough: true }) res: Response): Promise<void> {
    const user = await this.authService.validateUser(dto);
    const { accessToken, refreshToken } = await this.authService.signin(user);

    // 개발환경 고려하여 secure: false 추후 true로 변경 예정.
    const cookieOptions = {
      httpOnly: true,
      samesite: 'lax',
      secure: false,
      path: '/',
    };
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async signout(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response): Promise<void> {
    await this.authService.signout(req.user.userId);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  @Post('sign-up')
  signup(@Body() dto: SignupRequest): Promise<void> {
    return this.authService.signup(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: EmailVerifyRequest): Promise<void> {
    return this.authService.verifyEmail(dto);
  }

  // provider 추후에 수정.
  @Get('oauth/:provider')
  // @UseGuards(OAuthGuard)
  oauthLogin(): void {}

  @Get('oauth/:provider/callback')
  // @UseGuards(OAuthGuard)
  oauthCallback(@Req() req: Request): void {
    console.log(req);
  }

  @Post('refresh')
  // @UseGuards(RefreshGuard)
  refresh(@Req() req: Request): void {
    console.log(req);
  }
}

import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { CurrentUser, ExtractRefreshToken } from './decorator';
import { EmailVerifyRequest } from './dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshGuard } from './guard/refresh.guard';

import type { AuthenticatedUser, GeneratedAuthTokens } from '@/types/auth/auth.type';
// import { OAuthGuard } from '../guards/oauth.guard';
// import { LogoutGuard} from '../guards/logout.guard;
// import { RefreshGuard } from '../guards/refresh.guard';

@Controller('api/v1/auth')
export class AuthController {
  // 개발환경 고려하여 secure: false 추후 true로 변경 예정.
  private readonly cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: false,
    path: '/',
  };

  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(200)
  // 커스텀 가드에서 Email/PW 인증 후, user 객체가 request 객체에 주입됨.
  @UseGuards(LocalAuthGuard)
  async localSignIn(
    // 주입된 user 객체를 매개변수로 받음.
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    // generateAUthTokens에서 userId를 알아서 뽑아씀
    const tokens = await this.authService.generateAuthTokens(user);
    this.setNewAuthTokens(tokens, res);
  }

  @Post('sign-out')
  @HttpCode(204)
  // Jwt 인증이 된 상태에서 -> signout -> revocation 처리 -> 쿠키 삭제.
  @UseGuards(JwtAuthGuard)
  async signout(
    @ExtractRefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.revokeToken(refreshToken);

    res.clearCookie('accessToken', this.cookieOptions);
    res.clearCookie('refreshToken', this.cookieOptions);
    res.clearCookie('expiresAt', this.cookieOptions);
  }

  // @Post('sign-up')
  // signup(@Body() dto: SignupRequest): Promise<void> {
  //   return this.authService.signup(dto);
  // }

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
  @UseGuards(RefreshGuard)
  async refresh(
    @ExtractRefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.refreshTokens(refreshToken);
    this.setNewAuthTokens(tokens, res);
  }

  private setNewAuthTokens(tokens: GeneratedAuthTokens, res: Response): void {
    const { accessToken, refreshToken, expiresAt } = tokens;

    res.cookie('accessToken', accessToken, this.cookieOptions);
    res.cookie('refreshToken', refreshToken, this.cookieOptions);
    res.cookie('expiresAt', expiresAt.toISOString(), this.cookieOptions);
  }
}

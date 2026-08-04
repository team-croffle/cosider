import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { CurrentUser, ExtractRefreshToken } from './decorator';
import { AuthorizeDto, EmailVerifyRequest } from './dto';
import { SignupRequest } from './dto/signup-request.dto';
import { OAuthException } from './exception/oauth.exception';
import { OAuthExceptionFilter } from './filter/oauth-exception.filter';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { OAuthGuard } from './guard/oauth.guard';
import { RefreshGuard } from './guard/refresh.guard';

import type {
  AuthenticatedUser,
  GeneratedAuthTokens,
  OAuthUserPayload,
} from '@/types/auth/auth.type';

@Controller('api/v1/auth')
export class AuthController {
  // 개발환경 고려하여 secure: false 추후 true로 변경 예정.
  private readonly cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: false,
    path: '/',
  };

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-in')
  @HttpCode(200)
  // 커스텀 가드에서 Email/PW 인증 후, user 객체가 request 객체에 주입됨.
  @UseGuards(LocalAuthGuard)
  async localSignIn(
    // 주입된 user 객체를 매개변수로 받음.
    @CurrentUser() user: AuthenticatedUser,
    @Body() _dto: AuthorizeDto,
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

  @Post('sign-up')
  // 가입 요청 Acceptance
  @HttpCode(202)
  signup(@Body() dto: SignupRequest): Promise<void> {
    return this.authService.signupLocal(dto);
  }

  @Post('verify-email')
  // 이메일 인증 후 실제 record 생성
  @HttpCode(201)
  verifyEmail(@Body() dto: EmailVerifyRequest): Promise<void> {
    return this.authService.verifyEmail(dto);
  }

  @Get('oauth/:provider')
  @UseGuards(OAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  oauthLogin(): void {}

  @Get('oauth/:provider/callback')
  @UseGuards(OAuthGuard)
  @UseFilters(OAuthExceptionFilter)
  @Redirect()
  async oauthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('code') _code: string,
    @Query('state') _state: string,
  ): Promise<{ url: string }> {
    const user = req.user as OAuthUserPayload;
    if (!user) {
      throw new OAuthException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          errorCode: 'AUTH_FAILED',
          message: 'ERR_AUTH_FAILED',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokens = await this.authService.loginOrRegisterOAuth(user);
    this.setNewAuthTokens(tokens, res);

    const clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
    return { url: clientUrl };
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

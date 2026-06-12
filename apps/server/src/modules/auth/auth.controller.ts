import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { EmailVerifyRequest, SigninDto, SignupRequest } from './dto';

// import { OAuthGuard } from '../guards/oauth.guard';
// import { LogoutGuard} from '../guards/logout.guard;
// import { RefreshGuard } from '../guards/refresh.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() dto: SigninDto, @Res({ passthrough: true }) res: Response): Promise<void> {
    const user = await this.authService.validateUser(dto);
    const { accessToken, refreshToken } = await this.authService.signin(user);

    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', secure: true });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', secure: true });
  }

  @Post('signout')
  // @UseGuards(LogoutGuard)
  //Promise<void>
  logout(@Req() req: Request): void {
    console.log(req);
  }

  @Post('signup')
  signup(@Body() dto: SignupRequest): Promise<void> {
    return this.authService.signup(dto);
  }

  @Post('verify')
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

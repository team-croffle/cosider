import {
  LoginResponseDto,
  OAuthResponseDto,
  SignupRequestDto,
  VerifyEmailRequestDto,
} from '@cosider/shared';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
// import { OAuthGuard } from '../guards/oauth.guard';
// import { SigninGuard} from '../guards/signin.guard;
// import { LogoutGuard} from '../guards/logout.guard;
// import { RefreshGuard } from '../guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  // @UseGuards(SigninGuard)
  signin(@Req() req: Request): LoginResponseDto {
    console.log(req);
    return {
      accessToken: 'token',
      expiresIn: 1000,
    };
  }

  @Post('signout')
  // @UseGuards(LogoutGuard)
  //Promise<void>
  logout(@Req() req: Request): void {
    console.log(req);
  }

  @Post('signup')
  signup(@Body() dto: SignupRequestDto): Promise<void> {
    return this.authService.signup(dto);
  }

  @Post('verify')
  verifyEmail(@Body() dto: VerifyEmailRequestDto): Promise<void> {
    return this.authService.verifyEmail(dto);
  }

  // provider 추후에 수정.
  @Get('oauth/:provider')
  // @UseGuards(OAuthGuard)
  oauthLogin() {}

  @Get('oauth/:provider/callback')
  // @UseGuards(OAuthGuard)
  oauthCallback(@Req() req: Request): OAuthResponseDto {
    console.log(req);
    return {
      accessToken: 'token',
      expiresIn: 1000,
      isNewUser: true,
    };
  }

  @Post('refresh')
  // @UseGuards(RefreshGuard)
  refresh(@Req() req: Request): LoginResponseDto {
    console.log(req);
    return {
      accessToken: 'token',
      expiresIn: 1000,
    };
  }
}

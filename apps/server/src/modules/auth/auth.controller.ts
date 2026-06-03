import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { EmailVerifyRequest, SignupRequest } from './dto';

// import { OAuthGuard } from '../guards/oauth.guard';
// import { SigninGuard} from '../guards/signin.guard;
// import { LogoutGuard} from '../guards/logout.guard;
// import { RefreshGuard } from '../guards/refresh.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  // @UseGuards(SigninGuard)
  signin(@Req() req: Request): void {
    console.log(req);
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

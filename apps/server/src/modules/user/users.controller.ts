import { Controller, Get, Param, Query, SerializeOptions, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { UserProfileResponse } from './dto';
import { AuthUserResponse } from './dto/auth-user-response.dto';
import { ParseUserHandlePipe } from './pipes/parse-user-handle.pipe';
import { UsersService } from './users.service';

import { CheckExistsResponse } from '@/common/model';
import type { AuthenticatedUser } from '@/types/auth';

@Controller('api/v1/users')
@SerializeOptions({ excludeExtraneousValues: true })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser() user: AuthenticatedUser): Promise<AuthUserResponse> {
    const profile = await this.usersService.getProfile(user.userId);
    return new AuthUserResponse(profile);
  }

  @Get(':handle')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Param('handle', ParseUserHandlePipe) targetUserId: string,
  ): Promise<UserProfileResponse> {
    const profile = await this.usersService.getProfile(targetUserId);
    return new UserProfileResponse(profile);
  }

  @Get('exists/handle')
  async checkHandleExists(@Query('handle') handle: string): Promise<CheckExistsResponse> {
    return await this.usersService.checkHandleExists(handle);
  }
}

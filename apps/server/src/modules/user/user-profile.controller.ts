import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { UserProfileDetailResponse, UserProfileUpdateRequest } from './dto';
import { CreateProfileRequest } from './dto/create-profile-req.dto';
import { UsersService } from './users.service';

import { FileUploadCompletionRequest } from '@/common/file/dto';
import type { AuthenticatedUser } from '@/types/auth';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  async getMyProfileDetail(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserProfileDetailResponse> {
    const profile = await this.usersService.getProfileDetail(user.userId);
    return new UserProfileDetailResponse(profile);
  }

  @Post('me/profile')
  @UseGuards(JwtAuthGuard)
  async createMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProfileRequest,
  ): Promise<UserProfileDetailResponse> {
    const profile = await this.usersService.createProfile(user.userId, dto);
    return new UserProfileDetailResponse(profile);
  }

  @Patch('me/profile')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UserProfileUpdateRequest,
  ): Promise<UserProfileDetailResponse> {
    const profile = await this.usersService.updateProfile(user.userId, dto);
    return new UserProfileDetailResponse(profile);
  }

  @Patch('me/profile/avatar')
  @UseGuards(JwtAuthGuard)
  async updateMyProfileAvatar(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: FileUploadCompletionRequest,
  ): Promise<UserProfileDetailResponse> {
    const profile = await this.usersService.updateMyProfileAvatar(user.userId, dto);
    return new UserProfileDetailResponse(profile);
  }
}

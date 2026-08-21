import { Controller, Get, Post, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { WorkspaceInvitationsService } from './workspace-invitation.service';

import type { AuthenticatedUser } from '@/types/auth/auth.type';

@Controller('api/v1/invitations')
export class WorkspaceInvitationsController {
  constructor(private readonly workspaceInvitationsService: WorkspaceInvitationsService) {}

  @Get(':token')
  async checkInvitation(@Param('token') token: string): Promise<void> {
    return this.workspaceInvitationsService.checkInvitation(token);
  }

  @Post(':token/accept')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async acceptInvitation(
    @Param('token') token: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.workspaceInvitationsService.acceptInvitation(token, user);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../auth/decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { DelegateOwnerRequest, UpdateMemberRoleRequest, WorkspaceMemberResponse } from './dto';
import { ParseWorkspaceSlugPipe } from './pipes/parse-workspace-slug.pipe';
import { WorkspaceMembersService } from './workspace-member.service';

import type { AuthenticatedUser } from '@/types/auth/auth.type';

@Controller('api/v1/workspaces')
export class WorkspaceMembersController {
  constructor(private readonly workspaceMembersService: WorkspaceMembersService) {}

  // Workspace Member Apis
  @Get(':workspace_slug/members')
  @UseGuards(JwtAuthGuard)
  async getWorkspaceMemberList(
    @Param('workspace_slug', ParseWorkspaceSlugPipe) workspaceId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkspaceMemberResponse[]> {
    return this.workspaceMembersService.getWorkspaceMemberList(workspaceId, user.userId);
  }

  @Patch(':workspace_slug/members/:user_handle')
  @UseGuards(JwtAuthGuard)
  async updateMemberRole(
    @Param('workspace_slug', ParseWorkspaceSlugPipe) workspaceId: string,
    @Param('user_handle') userHandle: string,
    @Body() dto: UpdateMemberRoleRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.workspaceMembersService.updateMemberRole(workspaceId, userHandle, dto, user.userId);
  }

  @Delete(':workspace_slug/members/:user_handle')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async kickMemberFromWorkspace(
    @Param('workspace_slug', ParseWorkspaceSlugPipe) workspaceId: string,
    @Param('user_handle') userHandle: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.workspaceMembersService.kickMemberFromWorkspace(
      workspaceId,
      userHandle,
      user.userId,
    );
  }

  @Delete(':workspace_slug/members/me/leave')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveWorkspace(
    @Param('workspace_slug', ParseWorkspaceSlugPipe) workspaceId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.workspaceMembersService.leaveWorkspace(workspaceId, user.userId);
  }

  @Patch(':workspace_slug/owner-delegation')
  @UseGuards(JwtAuthGuard)
  async delegateOwner(
    @Param('workspace_slug', ParseWorkspaceSlugPipe) workspaceId: string,
    @Body() dto: DelegateOwnerRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.workspaceMembersService.delegateOwner(workspaceId, dto, user.userId);
  }
}

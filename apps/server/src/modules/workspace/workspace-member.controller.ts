import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../auth/decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ParseUserHandlePipe } from '../user/pipes/parse-user-handle.pipe';

import {
  DelegateOwnerRequest,
  MemberInvitationResponse,
  MemberInviteRequest,
  UpdateMemberRoleRequest,
  WorkspaceMemberResponse,
} from './dto';
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
    @Param('user_handle', ParseUserHandlePipe) targetUserId: string,
    @Body() dto: UpdateMemberRoleRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.workspaceMembersService.updateMemberRole(
      workspaceId,
      targetUserId,
      dto,
      user.userId,
    );
  }

  @Delete(':workspace_slug/members/:user_handle')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async kickMemberFromWorkspace(
    @Param('workspace_slug', ParseWorkspaceSlugPipe) workspaceId: string,
    @Param('user_handle', ParseUserHandlePipe) targetUserId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.workspaceMembersService.kickMemberFromWorkspace(
      workspaceId,
      targetUserId,
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

  // Workspace Invitation Apis
  @Post(':workspace_slug/invitations')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async inviteMember(
    @Param('workspace_slug', ParseWorkspaceSlugPipe) workspaceId: string,
    @Body() dto: MemberInviteRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MemberInvitationResponse> {
    return this.workspaceMembersService.inviteMember(workspaceId, dto, user.userId);
  }

  @Get(':workspace_slug/invitations')
  @UseGuards(JwtAuthGuard)
  async getInvitationList(
    @Param('workspace_slug', ParseWorkspaceSlugPipe) workspaceId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MemberInvitationResponse[]> {
    return this.workspaceMembersService.getInvitationList(workspaceId, user.userId);
  }

  @Delete(':workspace_slug/invitations/:invitation_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelMemberInvitation(
    @Param('workspace_slug', ParseWorkspaceSlugPipe) workspaceId: string,
    @Param('invitation_id', ParseUUIDPipe) invitationId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.workspaceMembersService.cancelMemberInvitation(
      workspaceId,
      invitationId,
      user.userId,
    );
  }
}

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';

import { DelegateOwnerRequest, UpdateMemberRoleRequest, WorkspaceMemberResponse } from './dto';
import { WorkspaceMembersService } from './workspace-member.service';

@Controller('api/v1/workspaces')
export class WorkspaceMembersController {
  constructor(private readonly workspaceMembersService: WorkspaceMembersService) {}

  // Workspace Member Apis
  @Get(':workspace_slug/members')
  async getWorkspaceMemberList(
    @Param('workspace_slug') workspaceSlug: string,
    // @CurrentUser() userId: string,
  ): Promise<WorkspaceMemberResponse[]> {
    return this.workspaceMembersService.getWorkspaceMemberList(workspaceSlug);
  }

  @Patch(':workspace_slug/members/:user_handle')
  async updateMemberRole(
    @Param('workspace_slug') workspaceSlug: string,
    @Param('user_handle') userHandle: string,
    @Body() dto: UpdateMemberRoleRequest,
  ): Promise<void> {
    return this.workspaceMembersService.updateMemberRole(workspaceSlug, userHandle, dto);
  }

  @Delete(':workspace_slug/members/:user_handle')
  @HttpCode(HttpStatus.NO_CONTENT)
  async kickMemberFromWorkspace(
    @Param('workspace_slug') workspaceSlug: string,
    @Param('user_handle') userHandle: string,
  ): Promise<void> {
    return this.workspaceMembersService.kickMemberFromWorkspace(workspaceSlug, userHandle);
  }

  @Delete(':workspace_slug/members/me/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveWorkspace(@Param('workspace_slug') workspaceSlug: string): Promise<void> {
    return this.workspaceMembersService.leaveWorkspace(workspaceSlug);
  }

  @Patch(':workspace_slug/owner-delegation')
  async delegateOwner(
    @Param('workspace_slug') workspaceSlug: string,
    @Body() dto: DelegateOwnerRequest,
  ): Promise<void> {
    return this.workspaceMembersService.delegateOwner(workspaceSlug, dto);
  }
}

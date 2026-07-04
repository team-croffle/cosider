import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../auth/decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceDeleteAcceptedResponse,
  WorkspaceDetailResponse,
  WorkspaceResponse,
} from './dto';
import { WorkspacesService } from './workspace.service';

import type { AuthenticatedUser } from '@/types/auth/auth.type';

@Controller('api/v1/workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  // Workspace Core Apis
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @Body() dto: CreateWorkspaceRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkspaceResponse> {
    return this.workspacesService.createWorkspace(dto, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getWorkspaceList(@CurrentUser() user: AuthenticatedUser): Promise<WorkspaceResponse[]> {
    return this.workspacesService.getWorkspaceList(user.userId);
  }

  @Get(':workspace_slug')
  @UseGuards(JwtAuthGuard)
  async getWorkspaceDetail(
    @Param('workspace_slug') workspaceSlug: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkspaceDetailResponse> {
    return this.workspacesService.getWorkspaceDetail(workspaceSlug, user.userId);
  }

  @Patch(':workspace_slug')
  @UseGuards(JwtAuthGuard)
  async updateWorkspace(
    @Param('workspace_slug') workspaceSlug: string,
    @Body() dto: UpdateWorkspaceRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkspaceResponse> {
    return this.workspacesService.updateWorkspace(workspaceSlug, dto, user.userId);
  }

  @Delete(':workspace_slug')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteWorkspace(
    @Param('workspace_slug') workspaceSlug: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkspaceDeleteAcceptedResponse> {
    return this.workspacesService.deleteWorkspace(workspaceSlug, user.userId);
  }

  @Post(':workspace_slug/restore')
  @UseGuards(JwtAuthGuard)
  async restoreWorkspace(
    @Param('workspace_slug') workspaceSlug: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.workspacesService.restoreWorkspace(workspaceSlug, user.userId);
  }
}

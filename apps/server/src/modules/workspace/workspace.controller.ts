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
} from '@nestjs/common';

import {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceDeleteAcceptedResponse,
  WorkspaceDetailResponse,
  WorkspaceResponse,
} from './dto';
import { WorkspacesService } from './workspace.service';

@Controller('api/v1/workspaces')
// @UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @Body() dto: CreateWorkspaceRequest /*@CurrentUser() userId: string*/,
  ): Promise<WorkspaceResponse> {
    return this.workspacesService.createWorkspace(dto);
  }

  @Get()
  async getWorkspaceList(/*@CurrentUser() userId: string*/): Promise<WorkspaceResponse[]> {
    return this.workspacesService.getWorkspaceList();
  }

  @Get(':workspace_slug')
  async getWorkspaceDetail(
    @Param('workspace_slug') workspaceSlug: string /*@CurrentUser() userId: string,*/,
  ): Promise<WorkspaceDetailResponse> {
    return this.workspacesService.getWorkspaceDetail(workspaceSlug);
  }

  @Patch(':workspace_slug')
  async updateWorkspace(
    @Param('workspace_slug') workspaceSlug: string,
    @Body() dto: UpdateWorkspaceRequest,
    // @CurrentUser() userId: string,
  ): Promise<WorkspaceResponse> {
    return this.workspacesService.updateWorkspace(workspaceSlug, dto);
  }

  @Delete(':workspace_slug')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteWorkspace(
    @Param('workspace_slug') workspaceSlug: string,
    // @CurrentUser() userId: string,
  ): Promise<WorkspaceDeleteAcceptedResponse> {
    return this.workspacesService.deleteWorkspace(workspaceSlug);
  }

  @Post(':workspace_slug/restore')
  async restoreWorkspace(
    @Param('workspace_slug') workspaceSlug: string,
    // @CurrentUser() userId: string,
  ): Promise<void> {
    return this.workspacesService.restoreWorkspace(workspaceSlug);
  }
}

import {
  CreateWorkspaceRequestDto,
  CreateWorkspaceResponseDto,
  DeleteWorkspaceResponseDto,
  GetWorkspaceDetailResponseDto,
  GetWorkspaceListResponseDto,
  UpdateWorkspaceRequestDto,
  UpdateWorkspaceResponseDto,
} from '@cosider/shared';
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

import { WorkspacesService } from './workspaces.service';

@Controller('api/v1/workspaces')
// @UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createWorkspace(
    @Body() dto: CreateWorkspaceRequestDto /*@CurrentUser() userId: string*/,
  ): Promise<CreateWorkspaceResponseDto> {
    return this.workspacesService.createWorkspace(dto);
  }

  @Get()
  getWorkspaceList(/*@CurrentUser() userId: string*/): Promise<GetWorkspaceListResponseDto> {
    return this.workspacesService.getWorkspaceList();
  }

  @Get(':workspace_slug')
  getWorkspaceDetail(
    @Param('workspace_slug') workspaceSlug: string /*@CurrentUser() userId: string,*/,
  ): Promise<GetWorkspaceDetailResponseDto> {
    return this.workspacesService.getWorkspaceDetail(workspaceSlug);
  }

  @Patch(':workspace_slug')
  updateWorkspace(
    @Param('workspace_slug') workspaceSlug: string,
    @Body() dto: UpdateWorkspaceRequestDto,
    // @CurrentUser() userId: string,
  ): Promise<UpdateWorkspaceResponseDto> {
    return this.workspacesService.updateWorkspace(workspaceSlug, dto);
  }

  @Delete(':workspace_slug')
  @HttpCode(HttpStatus.ACCEPTED)
  deleteWorkspace(
    @Param('workspace_slug') workspaceSlug: string,
    // @CurrentUser() userId: string,
  ): Promise<DeleteWorkspaceResponseDto> {
    return this.workspacesService.deleteWorkspace(workspaceSlug);
  }

  @Post(':workspace_slug/restore')
  restoreWorkspace(
    @Param('workspace_slug') workspaceSlug: string,
    // @CurrentUser() userId: string,
  ): Promise<void> {
    return this.workspacesService.restoreWorkspace(workspaceSlug);
  }
}

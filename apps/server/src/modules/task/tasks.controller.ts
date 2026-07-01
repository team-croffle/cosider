import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateNewTaskRequestDto, TaskResponseDto, UpdateTaskRequestDto } from './dto';
import { TasksService } from './tasks.service';

@Controller('api/v1/workspaces/:workspace_slug/projects/:project_key/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Task 생성
  @Post()
  async create(
    @Param('workspace_slug') workspaceSlug: string,
    @Param('project_key') projectKey: string,
    @Body() createTaskDto: CreateNewTaskRequestDto,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.create(workspaceSlug, projectKey, createTaskDto);
  }

  // Task 목록 조회
  @Get()
  async findAll(
    @Param('workspace_slug') workspaceSlug: string,
    @Param('project_key') projectKey: string,
  ): Promise<TaskResponseDto[]> {
    return await this.tasksService.findAll(workspaceSlug, projectKey);
  }

  // Task 상세 조회
  @Get(':task_number')
  async findOne(
    @Param('workspace_slug') workspaceSlug: string,
    @Param('project_key') projectKey: string,
    @Param('task_number', ParseIntPipe) taskNumber: number,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.findOne(workspaceSlug, projectKey, taskNumber);
  }

  // Task 수정
  @Patch(':task_number')
  async update(
    @Param('workspace_slug') workspaceSlug: string,
    @Param('project_key') projectKey: string,
    @Param('task_number', ParseIntPipe) taskNumber: number,
    @Body() updateTaskDto: UpdateTaskRequestDto,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.update(workspaceSlug, projectKey, taskNumber, updateTaskDto);
  }

  // Task 삭제
  @Delete(':task_number')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('workspace_slug') workspaceSlug: string,
    @Param('project_key') projectKey: string,
    @Param('task_number', ParseIntPipe) taskNumber: number,
  ): Promise<void> {
    await this.tasksService.remove(workspaceSlug, projectKey, taskNumber);
  }
}

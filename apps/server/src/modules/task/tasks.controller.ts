import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateNewTaskRequestDto, TaskResponseDto, UpdateTaskRequestDto } from './dto';
import { TasksService } from './tasks.service';

@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Task 생성
  @Post()
  async create(@Body() createTaskDto: CreateNewTaskRequestDto): Promise<TaskResponseDto> {
    return await this.tasksService.create(createTaskDto);
  }

  // Task 목록 조회
  @Get()
  async findAll(
    @Query('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ): Promise<TaskResponseDto[]> {
    return await this.tasksService.findAll(projectId);
  }

  // Task 상세 조회
  @Get(':task_number')
  async findOne(
    @Param('task_number', ParseIntPipe) taskNumber: number,
    @Query('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.findOne(projectId, taskNumber);
  }

  // Task 수정
  @Patch(':task_number')
  async update(
    @Param('task_number', ParseIntPipe) taskNumber: number,
    @Query('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
    @Body() updateTaskDto: UpdateTaskRequestDto,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.update(projectId, taskNumber, updateTaskDto);
  }

  // Task 삭제
  @Delete(':task_number')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('task_number', ParseIntPipe) taskNumber: number,
    @Query('projectId', new ParseUUIDPipe({ version: '4' })) projectId: string,
  ): Promise<void> {
    await this.tasksService.remove(projectId, taskNumber);
  }
}

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
  async findAll(): Promise<TaskResponseDto[]> {
    return await this.tasksService.findAll();
  }

  // Task 상세 조회
  @Get(':task_number')
  async findOne(@Param('task_number') task_number: string): Promise<TaskResponseDto> {
    return await this.tasksService.findOne(+task_number);
  }

  // Task 수정
  @Patch(':task_number')
  async update(
    @Param('task_number') task_number: string,
    @Body() updateTaskDto: UpdateTaskRequestDto,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.update(+task_number, updateTaskDto);
  }

  // Task 삭제
  @Delete(':task_number')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('task_number') task_number: string): Promise<void> {
    await this.tasksService.remove(+task_number);
  }
}

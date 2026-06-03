import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { EPriority } from '../common/priority.enum';

import { ETaskStatus } from './enums/task-status.enum';

export class CreateNewTaskRequestDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  assignee_handle?: string;

  @IsUUID('4')
  @IsOptional()
  sprint_id?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  linked_document_ids?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  linked_requirement_ids?: string[];

  @IsEnum(ETaskStatus)
  @IsNotEmpty()
  status!: ETaskStatus;

  @IsEnum(EPriority)
  @IsOptional()
  priority?: EPriority;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  due_date?: string;
}

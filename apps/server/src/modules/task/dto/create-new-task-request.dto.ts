import { EPriority, ETaskStatus } from '@cosider/shared';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNewTaskRequestDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  assigneeHandle?: string;

  @IsUUID('4')
  @IsOptional()
  sprintId?: string;

  @IsUUID('4')
  @IsOptional()
  linkedDocumentId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  linkedRequirementIds?: string[];

  @IsEnum(ETaskStatus)
  @IsNotEmpty()
  status!: ETaskStatus;

  @IsEnum(EPriority)
  @IsOptional()
  priority?: EPriority;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsUUID('4')
  @IsNotEmpty()
  projectId!: string;
}

import { EPriority, ETaskStatus, ICreateNewTaskRequest } from '@cosider/shared';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNewTaskRequestDto implements ICreateNewTaskRequest {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsString()
  @IsOptional()
  assigneeHandle?: string | null;

  @IsUUID('all')
  @IsOptional()
  sprintId?: string | null;

  @IsUUID('all')
  @IsOptional()
  linkedDocumentId?: string | null;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  linkedRequirementIds?: string[] | null;

  @IsEnum(ETaskStatus)
  @IsOptional()
  status?: ETaskStatus | null;

  @IsEnum(EPriority)
  @IsOptional()
  priority?: EPriority | null;

  @IsDateString()
  @IsOptional()
  startDate?: string | null;

  @IsDateString()
  @IsOptional()
  dueDate?: string | null;
}

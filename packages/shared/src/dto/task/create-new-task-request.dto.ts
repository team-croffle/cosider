import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'API 명세서 작성', description: '작업 제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'API 명세서를 작성합니다.', description: '작업 설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'user_handle_123', description: '작업 담당자 핸들' })
  @IsString()
  @IsOptional()
  assignee_handle?: string;

  @ApiPropertyOptional({ description: '소속된 스프린트 UUID' })
  @IsUUID('4')
  @IsOptional()
  sprint_id?: string;

  @ApiPropertyOptional({ description: '연동된 기획 문서 UUID 목록', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  linked_document_ids?: string[];

  @ApiPropertyOptional({ description: '연동된 요구사항 블록 UUID 목록', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  linked_requirement_ids?: string[];

  @ApiProperty({ enum: ETaskStatus, description: '작업 상태' })
  @IsEnum(ETaskStatus)
  @IsNotEmpty()
  status!: ETaskStatus;

  @ApiPropertyOptional({ enum: EPriority, description: '작업 중요도' })
  @IsEnum(EPriority)
  @IsOptional()
  priority?: EPriority;

  @ApiPropertyOptional({ example: '2026-06-02T12:00:00Z', description: '작업 시작일' })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional({ example: '2026-06-30T18:00:00Z', description: '작업 마감일' })
  @IsDateString()
  @IsOptional()
  due_date?: string;
}

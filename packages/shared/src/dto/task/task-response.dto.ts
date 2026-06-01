import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { EPriority } from '../common/priority.enum';

import { ETaskStatus } from './enums/task-status.enum';

export class TaskResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Task 고유 UUID' })
  id!: string;

  @ApiProperty({ example: 1, description: '프로젝트 내 Task 순번 (PROJ-1)' })
  task_number!: number;

  @ApiProperty({ example: 'API 명세서 작성', description: '작업 제목' })
  title!: string;

  @ApiPropertyOptional({ example: '로그인 API 명세서를 작성합니다.', description: '작업 설명' })
  description?: string;

  @ApiPropertyOptional({ example: 'user_handle_123', description: '작업 담당자 핸들' })
  assignee_handle?: string;

  @ApiPropertyOptional({ description: '소속된 스프린트 UUID' })
  sprint_id?: string;

  @ApiPropertyOptional({ description: '연동된 기획 문서 UUID 목록', type: [String] })
  linked_document_ids?: string[];

  @ApiPropertyOptional({ description: '연동된 요구사항 블록 UUID 목록', type: [String] })
  linked_requirement_ids?: string[];

  @ApiProperty({ enum: ETaskStatus, description: '작업 상태' })
  status!: ETaskStatus;

  @ApiPropertyOptional({ enum: EPriority, description: '작업 중요도' })
  priority?: EPriority;

  @ApiPropertyOptional({ example: '2026-06-02T10:00:00Z', description: '시작일 (ISO 8601)' })
  start_date?: string;

  @ApiPropertyOptional({ example: '2026-06-10T18:00:00Z', description: '목표 종료일 (ISO 8601)' })
  due_date?: string;

  @ApiProperty({ example: '김개발', description: '담당자 닉네임 (조인된 데이터)' })
  assignee_nickname!: string;

  @ApiProperty({ example: '이팀장', description: '생성자 닉네임 (조인된 데이터)' })
  reporter_nickname!: string;

  @ApiProperty({ example: '2026-06-02T18:00:00Z', description: '생성 일시' })
  created_at!: string;

  @ApiProperty({ example: '2026-06-02T18:00:00Z', description: '업데이트 일시' })
  updated_at!: string;
}

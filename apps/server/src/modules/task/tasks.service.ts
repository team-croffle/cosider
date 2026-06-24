import { EPriority, ITask } from '@cosider/shared';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, inArray } from 'drizzle-orm';

import { CreateNewTaskRequestDto, TaskResponseDto, UpdateTaskRequestDto } from './dto';

import { DB_CONNECTION } from '@/common/constants';
import { type DrizzleDB } from '@/database/drizzle.module';
import { requirementTaskLinks, tasks } from '@/database/schema';

type DBTaskRowFromITask = Omit<ITask, 'startDate' | 'dueDate' | 'createdAt' | 'updatedAt'> & {
  startDate: Date | null;
  dueDate: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

@Injectable()
export class TasksService {
  constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}

  private mapRowToDto(row: DBTaskRowFromITask, linkedRequirementIds?: string[]): TaskResponseDto {
    return {
      id: row.id,
      taskNumber: row.taskNumber,
      title: row.title,
      description: row.description ?? undefined,
      assigneeHandle: undefined,
      sprintId: row.sprintId ?? undefined,
      linkedDocumentId: row.linkedDocumentId ?? undefined,
      linkedRequirementIds: linkedRequirementIds ?? undefined,
      status: row.status,
      priority: row.priority ?? undefined,
      startDate: row.startDate ? row.startDate.toISOString() : undefined,
      dueDate: row.dueDate ? row.dueDate.toISOString() : undefined,
      assigneeNickname: row.assigneeNickname ?? '',
      reporterNickname: row.reporterNickname ?? '',
      createdAt: row.createdAt ? row.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: row.updatedAt ? row.updatedAt.toISOString() : new Date().toISOString(),
    };
  }

  // Task 생성
  async create(createNewTaskDto: CreateNewTaskRequestDto): Promise<TaskResponseDto> {
    const projectId = createNewTaskDto.projectId;
    if (!projectId) {
      throw new BadRequestException('projectId is required');
    }

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;

      try {
        return await this.db.transaction(async (tx) => {
          const last = await tx
            .select()
            .from(tasks)
            .where(eq(tasks.projectId, projectId))
            .orderBy(desc(tasks.taskNumber))
            .limit(1);

          const nextTaskNumber = (last[0]?.taskNumber ?? 0) + 1;

          const [inserted] = await tx
            .insert(tasks)
            .values({
              projectId,
              taskNumber: nextTaskNumber,
              title: createNewTaskDto.title,
              description: createNewTaskDto.description ?? null,
              assigneeId: null,
              assigneeNickname: null,
              reporterId: null,
              reporterNickname: null,
              linkedDocumentId: createNewTaskDto.linkedDocumentId ?? null,
              sprintId: createNewTaskDto.sprintId ?? null,
              status: createNewTaskDto.status,
              priority: createNewTaskDto.priority ?? EPriority.MID,
              startDate: createNewTaskDto.startDate ? new Date(createNewTaskDto.startDate) : null,
              dueDate: createNewTaskDto.dueDate ? new Date(createNewTaskDto.dueDate) : null,
            })
            .returning();

          if (!inserted) {
            throw new Error('Insert failed');
          }

          if (createNewTaskDto.linkedRequirementIds?.length) {
            const links = createNewTaskDto.linkedRequirementIds.map((reqId) => ({
              requirementId: reqId,
              taskId: inserted.id,
            }));
            await tx.insert(requirementTaskLinks).values(links);
          }

          return this.mapRowToDto(inserted, createNewTaskDto.linkedRequirementIds);
        });
      } catch (error: unknown) {
        const isPgError = (err: unknown): err is { code: string } => {
          return typeof err === 'object' && err !== null && 'code' in err;
        };

        if (isPgError(error) && error.code === '23505') {
          if (attempt === maxRetries) {
            throw new BadRequestException(
              'Failed to create task after multiple attempts due to concurrent insertions. Please try again.',
            );
          }
          continue; // Retry the transaction
        }
        throw error; // Rethrow other errors
      }
    }
    throw new BadRequestException('Failed to create task');
  }

  // Task 목록 조회
  async findAll(projectId: string): Promise<TaskResponseDto[]> {
    const rows = await this.db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));

    // 없으면 빈 배열 반환
    if (rows.length === 0) {
      return [];
    }

    const taskIds = rows.map((row) => row.id);

    const links = await this.db
      .select()
      .from(requirementTaskLinks)
      .where(inArray(requirementTaskLinks.taskId, taskIds));

    const linksMap = links.reduce(
      (acc, link) => {
        if (!acc[link.taskId]) {
          acc[link.taskId] = [];
        }
        acc[link.taskId].push(link.requirementId);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    return rows.map((row) => this.mapRowToDto(row as DBTaskRowFromITask, linksMap[row.id] || []));
  }
  // Task 상세 조회
  async findOne(projectId: string, taskNumber: number): Promise<TaskResponseDto> {
    const [row] = await this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.taskNumber, taskNumber)))
      .limit(1);

    if (!row) {
      throw new NotFoundException('Task not found');
    }

    const links = await this.db
      .select({ requirementId: requirementTaskLinks.requirementId })
      .from(requirementTaskLinks)
      .where(eq(requirementTaskLinks.taskId, row.id));

    return this.mapRowToDto(
      row,
      links.map((link) => link.requirementId),
    );
  }
  // Task 수정
  async update(
    projectId: string,
    taskNumber: number,
    updateTaskDto: UpdateTaskRequestDto,
  ): Promise<TaskResponseDto> {
    const [existing] = await this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.taskNumber, taskNumber)))
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    const patch: Partial<{
      title: string;
      description: string | null;
      sprintId: string | null;
      linkedDocumentId: string | null;
      status: (typeof tasks.$inferInsert)['status'];
      priority: (typeof tasks.$inferInsert)['priority'];
      startDate: Date | null;
      dueDate: Date | null;
      updatedAt: Date;
    }> = {};

    if (updateTaskDto.title !== undefined) patch.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined)
      patch.description = updateTaskDto.description ?? null;
    if (updateTaskDto.sprintId !== undefined) patch.sprintId = updateTaskDto.sprintId ?? null;
    if (updateTaskDto.linkedDocumentId !== undefined)
      patch.linkedDocumentId = updateTaskDto.linkedDocumentId ?? null;
    if (updateTaskDto.status !== undefined) patch.status = updateTaskDto.status;
    if (updateTaskDto.priority !== undefined) patch.priority = updateTaskDto.priority;
    if (updateTaskDto.startDate !== undefined) {
      patch.startDate = updateTaskDto.startDate ? new Date(updateTaskDto.startDate) : null;
    }
    if (updateTaskDto.dueDate !== undefined) {
      patch.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null;
    }

    let updatedRow = existing;
    if (Object.keys(patch).length > 0) {
      patch.updatedAt = new Date();

      const [updated] = await this.db
        .update(tasks)
        .set(patch)
        .where(eq(tasks.id, existing.id))
        .returning();

      if (!updated) {
        throw new BadRequestException('Failed to update task');
      }

      updatedRow = updated;
    }

    // linkedRequirementIds가 넘어오면 기존 링크 교체
    if (updateTaskDto.linkedRequirementIds !== undefined) {
      await this.db
        .delete(requirementTaskLinks)
        .where(eq(requirementTaskLinks.taskId, updatedRow.id));

      if (updateTaskDto.linkedRequirementIds.length > 0) {
        await this.db.insert(requirementTaskLinks).values(
          updateTaskDto.linkedRequirementIds.map((requirementId) => ({
            requirementId,
            taskId: updatedRow.id,
          })),
        );
      }
    }

    const links = await this.db
      .select({ requirementId: requirementTaskLinks.requirementId })
      .from(requirementTaskLinks)
      .where(eq(requirementTaskLinks.taskId, updatedRow.id));

    return this.mapRowToDto(
      updatedRow,
      links.map((l) => l.requirementId),
    );
  }

  // Task 삭제
  async remove(projectId: string, taskNumber: number): Promise<void> {
    const [existing] = await this.db
      .select({ id: tasks.id })
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.taskNumber, taskNumber)))
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    await this.db.delete(tasks).where(eq(tasks.id, existing.id));
  }
}

import { EPriority, IFileMetadata, ITaskParticipantResponse } from '@cosider/shared';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, inArray, isNull, sql } from 'drizzle-orm';

import { CreateNewTaskRequestDto, TaskResponseDto, UpdateTaskRequestDto } from './dto';
import { mapAttachmentRow, mapParticipantRow, mapTaskRowToDto } from './tasks.mapper';
import type { DBTaskRowFromITask } from './tasks.types';

import { DB_CONNECTION } from '@/common/constants';
import { RedisService } from '@/common/redis/redis.service';
import { type DrizzleDB } from '@/database/drizzle.module';
import {
  mediaFiles,
  projectTaskCounters,
  projectMembers,
  projects,
  requirementTaskLinks,
  taskAttachments,
  tasks,
  userProfiles,
  users,
  workspaceMembers,
} from '@/database/schema';

@Injectable()
export class TasksService {
  private static readonly TASK_CACHE_TTL_SECONDS = 60 * 5;
  constructor(
    @Inject(DB_CONNECTION) private readonly db: DrizzleDB,
    private readonly redisService: RedisService,
  ) {}

  private getTaskListCacheKey(projectId: string): string {
    return `task:list:${projectId}`;
  }

  private async invalidateTaskListCache(projectId: string): Promise<void> {
    await this.redisService.del(this.getTaskListCacheKey(projectId));
  }

  private getParticipantSelectFields() {
    return {
      id: users.id,
      email: users.email,
      handle: userProfiles.handle,
      nickname: userProfiles.nickname,
      profileImageId: userProfiles.profileImageId,
      updatedAt: userProfiles.updatedAt,
      handleUpdatedAt: userProfiles.handleUpdatedAt,
    };
  }

  private async findParticipantByUserIdOrThrow(userId: string): Promise<ITaskParticipantResponse> {
    const [participant] = await this.db
      .select(this.getParticipantSelectFields())
      .from(users)
      .innerJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(users.id, userId))
      .limit(1);

    if (!participant) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return mapParticipantRow(participant);
  }

  private async findParticipantByHandleOrThrow(handle: string): Promise<ITaskParticipantResponse> {
    const [participant] = await this.db
      .select(this.getParticipantSelectFields())
      .from(users)
      .innerJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(userProfiles.handle, handle))
      .limit(1);

    if (!participant) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return mapParticipantRow(participant);
  }

  private async findParticipantsByUserIdsOrThrow(
    userIds: string[],
  ): Promise<Map<string, ITaskParticipantResponse>> {
    if (userIds.length === 0) {
      return new Map();
    }

    const rows = await this.db
      .select(this.getParticipantSelectFields())
      .from(users)
      .innerJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(inArray(users.id, userIds));

    return new Map(rows.map((row) => [row.id, mapParticipantRow(row)]));
  }

  private async findAttachmentsByTaskId(taskId: string): Promise<IFileMetadata[]> {
    const attachmentsByTaskId = await this.findAttachmentsByTaskIds([taskId]);
    return attachmentsByTaskId.get(taskId) ?? [];
  }

  private async findAttachmentsByTaskIds(taskIds: string[]): Promise<Map<string, IFileMetadata[]>> {
    if (taskIds.length === 0) {
      return new Map();
    }

    const rows = await this.db
      .select({
        taskId: taskAttachments.taskId,
        id: mediaFiles.id,
        fileName: mediaFiles.fileName,
        mimeType: mediaFiles.mimeType,
        fileSize: mediaFiles.fileSize,
        visibility: mediaFiles.visibility,
        createdAt: mediaFiles.createdAt,
      })
      .from(taskAttachments)
      .innerJoin(mediaFiles, eq(taskAttachments.fileId, mediaFiles.id))
      .where(inArray(taskAttachments.taskId, taskIds));

    return rows.reduce((acc, row) => {
      const attachments = acc.get(row.taskId) ?? [];

      attachments.push(mapAttachmentRow(row));

      acc.set(row.taskId, attachments);
      return acc;
    }, new Map<string, IFileMetadata[]>());
  }

  private async findProjectIdOrThrow(
    userId: string,
    workspaceId: string,
    projectKey: string,
  ): Promise<string> {
    const [project] = await this.db
      .select({ id: projects.id })
      .from(projects)
      .innerJoin(workspaceMembers, eq(projects.workspaceId, workspaceMembers.workspaceId))
      .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
      .where(
        and(
          eq(projects.workspaceId, workspaceId),
          eq(projects.key, projectKey),
          eq(workspaceMembers.userId, userId),
          eq(projectMembers.userId, userId),
          isNull(projects.deletedAt),
        ),
      )
      .limit(1);

    if (!project) {
      throw new NotFoundException('Project not found or access denied');
    }

    return project.id;
  }

  // Task 생성
  async create(
    userId: string,
    workspaceId: string,
    projectKey: string,
    createNewTaskDto: CreateNewTaskRequestDto,
  ): Promise<TaskResponseDto> {
    const projectId = await this.findProjectIdOrThrow(userId, workspaceId, projectKey);
    const reporter = await this.findParticipantByUserIdOrThrow(userId);
    const nextAssignee = createNewTaskDto.assigneeHandle
      ? await this.findParticipantByHandleOrThrow(createNewTaskDto.assigneeHandle)
      : reporter;

    const result = await this.db.transaction(async (tx) => {
      const [{ nextTaskNumber }] = await tx
        .insert(projectTaskCounters)
        .values({
          projectId,
          lastTaskNumber: 1,
        })
        .onConflictDoUpdate({
          target: [projectTaskCounters.projectId],
          set: { lastTaskNumber: sql`${projectTaskCounters.lastTaskNumber} + 1` },
        })
        .returning({ nextTaskNumber: projectTaskCounters.lastTaskNumber });

      const [inserted] = await tx
        .insert(tasks)
        .values({
          projectId,
          taskNumber: nextTaskNumber,
          title: createNewTaskDto.title,
          description: createNewTaskDto.description ?? null,
          assigneeId: nextAssignee.id,
          assigneeNickname: nextAssignee.nickname,
          reporterId: reporter.id,
          reporterNickname: reporter.nickname,
          linkedDocumentId: createNewTaskDto.linkedDocumentId ?? null,
          sprintId: createNewTaskDto.sprintId ?? null,
          status: createNewTaskDto.status,
          priority: createNewTaskDto.priority ?? EPriority.MID,
          startDate: createNewTaskDto.startDate ? new Date(createNewTaskDto.startDate) : null,
          dueDate: createNewTaskDto.dueDate ? new Date(createNewTaskDto.dueDate) : null,
        })
        .returning();

      if (!inserted) {
        throw new BadRequestException('Insert failed');
      }

      if (createNewTaskDto.linkedRequirementIds?.length) {
        const links = createNewTaskDto.linkedRequirementIds.map((reqId) => ({
          requirementId: reqId,
          taskId: inserted.id,
        }));
        await tx.insert(requirementTaskLinks).values(links);
      }

      return mapTaskRowToDto(
        inserted,
        createNewTaskDto.linkedRequirementIds,
        nextAssignee,
        reporter,
        [],
      );
    });
    await this.invalidateTaskListCache(projectId);
    return result;
  }

  // Task 목록 조회
  async findAll(
    userId: string,
    workspaceId: string,
    projectKey: string,
  ): Promise<TaskResponseDto[]> {
    const projectId = await this.findProjectIdOrThrow(userId, workspaceId, projectKey);

    const cacheKey = this.getTaskListCacheKey(projectId);
    const cached = await this.redisService.getJson<TaskResponseDto[]>(cacheKey);
    if (cached) return cached;

    const rows = await this.db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));

    if (rows.length === 0) {
      const empty: TaskResponseDto[] = [];
      await this.redisService.setJson(cacheKey, empty, TasksService.TASK_CACHE_TTL_SECONDS);
      return empty;
    }

    const taskIds = rows.map((row) => row.id);
    const participantIds = Array.from(
      new Set(
        rows
          .flatMap((row) => [row.assigneeId, row.reporterId])
          .filter((id): id is string => Boolean(id)),
      ),
    );

    const [links, participantsMap, attachmentsMap] = await Promise.all([
      this.db
        .select()
        .from(requirementTaskLinks)
        .where(inArray(requirementTaskLinks.taskId, taskIds)),
      this.findParticipantsByUserIdsOrThrow(participantIds),
      this.findAttachmentsByTaskIds(taskIds),
    ]);

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

    const result = rows.map((row) => {
      const taskRow = row as DBTaskRowFromITask;

      if (!taskRow.assigneeId || !taskRow.reporterId) {
        throw new NotFoundException('Task participant not found');
      }

      const taskAssignee = participantsMap.get(taskRow.assigneeId);
      const taskReporter = participantsMap.get(taskRow.reporterId);
      const attachments = attachmentsMap.get(taskRow.id) ?? [];

      if (!taskAssignee || !taskReporter) {
        throw new NotFoundException('Task participant not found');
      }

      return mapTaskRowToDto(
        taskRow,
        linksMap[row.id] || [],
        taskAssignee,
        taskReporter,
        attachments,
      );
    });

    await this.redisService.setJson(cacheKey, result, TasksService.TASK_CACHE_TTL_SECONDS);
    return result;
  }

  // Task 상세 조회
  async findOne(
    userId: string,
    workspaceId: string,
    projectKey: string,
    taskNumber: number,
  ): Promise<TaskResponseDto> {
    const projectId = await this.findProjectIdOrThrow(userId, workspaceId, projectKey);

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

    if (!row.assigneeId || !row.reporterId) {
      throw new NotFoundException('Task participant not found');
    }

    const [assignee, reporter, attachments] = await Promise.all([
      this.findParticipantByUserIdOrThrow(row.assigneeId),
      this.findParticipantByUserIdOrThrow(row.reporterId),
      this.findAttachmentsByTaskId(row.id),
    ]);

    return mapTaskRowToDto(
      row,
      links.map((link) => link.requirementId),
      assignee,
      reporter,
      attachments,
    );
  }

  // Task 수정
  async update(
    userId: string,
    workspaceId: string,
    projectKey: string,
    taskNumber: number,
    updateTaskDto: UpdateTaskRequestDto,
  ): Promise<TaskResponseDto> {
    const projectId = await this.findProjectIdOrThrow(userId, workspaceId, projectKey);
    const nextAssignee =
      updateTaskDto.assigneeHandle !== undefined
        ? await this.findParticipantByHandleOrThrow(updateTaskDto.assigneeHandle)
        : null;

    const result = await this.db.transaction(async (tx) => {
      const [existing] = await tx
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
        assigneeId: string | null;
        assigneeNickname: string | null;
        sprintId: string | null;
        linkedDocumentId: string | null;
        status: (typeof tasks.$inferInsert)['status'];
        priority: (typeof tasks.$inferInsert)['priority'];
        startDate: Date | null;
        dueDate: Date | null;
        updatedAt: Date;
      }> = {};

      if (updateTaskDto.title !== undefined) patch.title = updateTaskDto.title;
      if (updateTaskDto.description !== undefined) {
        patch.description = updateTaskDto.description ?? null;
      }
      if (nextAssignee) {
        patch.assigneeId = nextAssignee.id;
        patch.assigneeNickname = nextAssignee.nickname;
      }
      if (updateTaskDto.sprintId !== undefined) patch.sprintId = updateTaskDto.sprintId ?? null;
      if (updateTaskDto.linkedDocumentId !== undefined) {
        patch.linkedDocumentId = updateTaskDto.linkedDocumentId ?? null;
      }
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

        const [updated] = await tx
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
        await tx.delete(requirementTaskLinks).where(eq(requirementTaskLinks.taskId, updatedRow.id));

        if (updateTaskDto.linkedRequirementIds.length > 0) {
          await tx.insert(requirementTaskLinks).values(
            updateTaskDto.linkedRequirementIds.map((requirementId) => ({
              requirementId,
              taskId: updatedRow.id,
            })),
          );
        }
      }

      const links = await tx
        .select({ requirementId: requirementTaskLinks.requirementId })
        .from(requirementTaskLinks)
        .where(eq(requirementTaskLinks.taskId, updatedRow.id));

      if (!updatedRow.assigneeId || !updatedRow.reporterId) {
        throw new NotFoundException('Task participant not found');
      }

      const [taskAssignee, taskReporter, attachments] = await Promise.all([
        this.findParticipantByUserIdOrThrow(updatedRow.assigneeId),
        this.findParticipantByUserIdOrThrow(updatedRow.reporterId),
        this.findAttachmentsByTaskId(updatedRow.id),
      ]);

      return mapTaskRowToDto(
        updatedRow,
        links.map((l) => l.requirementId),
        taskAssignee,
        taskReporter,
        attachments,
      );
    });

    await this.invalidateTaskListCache(projectId);
    return result;
  }

  // Task 삭제
  async remove(
    userId: string,
    workspaceId: string,
    projectKey: string,
    taskNumber: number,
  ): Promise<void> {
    const projectId = await this.findProjectIdOrThrow(userId, workspaceId, projectKey);

    const [existing] = await this.db
      .select({ id: tasks.id })
      .from(tasks)
      .where(and(eq(tasks.projectId, projectId), eq(tasks.taskNumber, taskNumber)))
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    await this.db.delete(tasks).where(eq(tasks.id, existing.id));
    await this.invalidateTaskListCache(projectId);
  }
}

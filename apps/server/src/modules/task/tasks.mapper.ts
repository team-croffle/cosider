import { IFileMetadata, ITaskParticipantResponse } from '@cosider/shared';
import { NotFoundException } from '@nestjs/common';

import { TaskResponseDto } from './dto';
import type { DBTaskRowFromITask, TaskParticipantRow, TaskAttachmentRow } from './tasks.types';

export function formatRequiredTimestamp(timestamp: Date | null, errorMessage: string): string {
  if (!timestamp) {
    throw new NotFoundException(errorMessage);
  }

  return timestamp.toISOString();
}

export function mapParticipantRow(row: TaskParticipantRow): ITaskParticipantResponse {
  return {
    id: row.id,
    email: row.email,
    handle: row.handle,
    nickname: row.nickname,
    profileImageId: row.profileImageId,
    updatedAt: formatRequiredTimestamp(row.updatedAt, 'Participant updatedAt not found'),
    handleUpdatedAt: formatRequiredTimestamp(
      row.handleUpdatedAt,
      'Participant handleUpdatedAt not found',
    ),
  };
}

export function mapAttachmentRow(row: TaskAttachmentRow): IFileMetadata {
  return {
    id: row.id,
    fileName: row.fileName,
    mimeType: row.mimeType,
    fileSize: row.fileSize,
    visibility: row.visibility,
    createdAt: formatRequiredTimestamp(row.createdAt, 'Attachment createdAt not found'),
  };
}

export function mapTaskRowToDto(
  row: DBTaskRowFromITask,
  linkedRequirementIds: string[] | null | undefined,
  assignee: ITaskParticipantResponse,
  reporter: ITaskParticipantResponse,
  attachments: IFileMetadata[] | null,
): TaskResponseDto {
  if (!row.createdAt) {
    throw new NotFoundException('Task createdAt not found');
  }

  if (!row.updatedAt) {
    throw new NotFoundException('Task updatedAt not found');
  }

  return {
    id: row.id,
    taskNumber: row.taskNumber,
    title: row.title,
    description: row.description,
    sprintId: row.sprintId,
    linkedDocumentIds: row.linkedDocumentId ? [row.linkedDocumentId] : null,
    linkedRequirementIds: linkedRequirementIds ?? null,
    status: row.status,
    priority: row.priority,
    startDate: row.startDate ? row.startDate.toISOString() : null,
    dueDate: row.dueDate ? row.dueDate.toISOString() : null,
    attachments,
    assignee,
    reporter,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

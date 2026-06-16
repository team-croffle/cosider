import { EWorkspaceStatus, EWorkspaceUserRole } from '@cosider/shared';
import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceDeleteAcceptedResponse,
  WorkspaceDetailResponse,
  WorkspaceResponse,
} from './dto';

import { DB_CONNECTION, type DrizzleDB } from '@/database/drizzle.module';
import { userProfiles, workspace_members, workspaces } from '@/database/schema';

@Injectable()
export class WorkspacesService {
  constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}

  async createWorkspace(dto: CreateWorkspaceRequest): Promise<WorkspaceResponse> {
    // 트랜잭션으로 워크스페이스와 워크스페이스 멤버 등록을 함께 생성
    const workspace = await this.db.transaction(async (tx) => {
      const [created] = await tx
        .insert(workspaces)
        .values({
          ownerId: '00000000-0000-0000-0000-000000000000', // TODO: 로그인 유저 ID로 교체
          slug: dto.slug,
          name: dto.name,
          description: dto.description,
          logoImageKey: dto.logoUploadToken, // TODO: uploadToken -> S3 Key 변환 후 교체
        })
        .returning()
        .catch((e: { code: string }) => {
          if (e.code === '23505') {
            throw new ConflictException('이미 사용중인 slug입니다.');
          }
          throw e;
        });

      if (!created) {
        throw new InternalServerErrorException('워크스페이스 생성에 실패했습니다.');
      }

      await tx.insert(workspace_members).values({
        userId: '00000000-0000-0000-0000-000000000000', // TODO: 로그인 유저 ID로 교체
        workspaceId: created.id,
        role: EWorkspaceUserRole.OWNER,
      });

      return created;
    });

    return {
      slug: workspace.slug,
      name: workspace.name,
      status: workspace.status,
      description: workspace.description ?? '',
      logoUrl: '', // TODO: S3에서 logoImageKey로 PresignedURL 변환 후 교체
      createdAt: workspace.createdAt.toISOString(),
      role: EWorkspaceUserRole.OWNER,
    };
  }

  async getWorkspaceList(): Promise<WorkspaceResponse[]> {
    const workspaceList = await this.db
      .select({
        slug: workspaces.slug,
        name: workspaces.name,
        status: workspaces.status,
        description: workspaces.description,
        logoImageKey: workspaces.logoImageKey, // S3 Key -> URL 변환 필요
        createdAt: workspaces.createdAt,
        role: workspace_members.role,
      })
      .from(workspace_members)
      .innerJoin(workspaces, eq(workspace_members.workspaceId, workspaces.id))
      .where(eq(workspace_members.userId, '00000000-0000-0000-0000-000000000000')); // TODO: 로그인 유저 ID로 교체

    return workspaceList.map((w) => ({
      slug: w.slug,
      name: w.name,
      status: w.status,
      description: w.description ?? '',
      logoUrl: w.logoImageKey ?? '', // TODO: S3에서 logoImageKey로 PresignedURL 변환 후 교체
      createdAt: w.createdAt.toISOString(),
      role: w.role,
    }));
  }

  async getWorkspaceDetail(workspaceSlug: string): Promise<WorkspaceDetailResponse> {
    const [workspace] = await this.db
      .select({
        slug: workspaces.slug,
        name: workspaces.name,
        status: workspaces.status,
        description: workspaces.description,
        logoImageKey: workspaces.logoImageKey, // S3 Key -> URL 변환 필요
        createdAt: workspaces.createdAt,
        role: workspace_members.role,
        owner: {
          handle: userProfiles.handle,
          nickname: userProfiles.nickname,
          profileImageUrl: userProfiles.profileImageKey, // S3 Key -> URL 변환 필요
        },
      })
      .from(workspaces)
      .innerJoin(workspace_members, eq(workspaces.id, workspace_members.workspaceId))
      .innerJoin(userProfiles, eq(workspaces.ownerId, userProfiles.userId))
      .where(
        and(
          eq(workspaces.slug, workspaceSlug),
          eq(workspace_members.userId, '00000000-0000-0000-0000-000000000000'), // TODO: 로그인 유저 ID로 교체
        ),
      );

    if (!workspace) {
      throw new NotFoundException('존재하지 않는 워크스페이스입니다.');
    }

    return {
      slug: workspace.slug,
      name: workspace.name,
      status: workspace.status,
      description: workspace.description ?? '',
      logoUrl: workspace.logoImageKey ?? '',
      createdAt: workspace.createdAt.toISOString(),
      role: workspace.role,
      owner: workspace.owner,
      projects: [], // TODO: 프로젝트 정보로 교체
    };
  }

  async updateWorkspace(
    workspaceSlug: string,
    dto: UpdateWorkspaceRequest,
  ): Promise<WorkspaceResponse> {
    const [updatedWorkspace] = await this.db
      .update(workspaces)
      .set({
        name: dto.name,
        description: dto.description,
        slug: dto.slug,
      })
      .where(eq(workspaces.slug, workspaceSlug))
      .returning();

    if (!updatedWorkspace) {
      throw new NotFoundException('존재하지 않는 워크스페이스입니다.');
    }

    const [member] = await this.db
      .select({ role: workspace_members.role })
      .from(workspace_members)
      .where(
        and(
          eq(workspace_members.workspaceId, updatedWorkspace.id),
          eq(workspace_members.userId, '00000000-0000-0000-0000-000000000000'), // TODO: 로그인 유저 ID로 교체
        ),
      );

    if (!member) {
      throw new NotFoundException('워크스페이스 멤버를 찾을 수 없습니다.');
    }

    return {
      slug: updatedWorkspace.slug,
      name: updatedWorkspace.name,
      status: updatedWorkspace.status,
      description: updatedWorkspace.description ?? '',
      logoUrl: updatedWorkspace.logoImageKey ?? '', // TODO: S3 Key → URL 변환
      createdAt: updatedWorkspace.createdAt.toISOString(),
      role: member.role,
    };
  }

  async deleteWorkspace(workspaceSlug: string): Promise<WorkspaceDeleteAcceptedResponse> {
    const [deletedWorkspace] = await this.db
      .update(workspaces)
      .set({
        status: EWorkspaceStatus.DELETE_PENDING,
        deletedAt: new Date(),
        scheduledDeleteAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후 (FRID-32 기준)
      })
      .where(eq(workspaces.slug, workspaceSlug))
      .returning();

    if (!deletedWorkspace) {
      throw new NotFoundException('존재하지 않는 워크스페이스입니다.');
    }

    return {
      slug: workspaceSlug,
      status: EWorkspaceStatus.DELETE_PENDING,
      deletedAt: deletedWorkspace.deletedAt!.toISOString(),
      scheduledDeleteAt: deletedWorkspace.scheduledDeleteAt!.toISOString(),
    };
  }

  async restoreWorkspace(workspaceSlug: string): Promise<void> {
    const [restoredWorkspace] = await this.db
      .update(workspaces)
      .set({
        status: EWorkspaceStatus.ACTIVE,
        deletedAt: null,
        scheduledDeleteAt: null,
      })
      .where(eq(workspaces.slug, workspaceSlug))
      .returning();

    if (!restoredWorkspace) {
      throw new NotFoundException('존재하지 않는 워크스페이스입니다.');
    }
  }
}

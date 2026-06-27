import { EWorkspaceUserRole } from '@cosider/shared';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { DelegateOwnerRequest, UpdateMemberRoleRequest, WorkspaceMemberResponse } from './dto';

import { DB_CONNECTION } from '@/common/constants';
import { type DrizzleDB } from '@/database/drizzle.module';
import { userProfiles, workspace_members, workspaces } from '@/database/schema';

const ROLE_RANK: Record<EWorkspaceUserRole, number> = {
  // 숫자가 작을수록 권한 높음. 동급/상급 멤버를 방출/역할변경 못하게 막는 비교용.
  // 문서에 명시된 규칙은 아니고 서비스 내부에서만 사용되는 규칙임.
  [EWorkspaceUserRole.OWNER]: 0,
  [EWorkspaceUserRole.ADMIN]: 1,
  [EWorkspaceUserRole.MEMBER]: 2,
  [EWorkspaceUserRole.VIEWER]: 3,
};

@Injectable()
export class WorkspaceMembersService {
  constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}

  async getWorkspaceMemberList(workspaceSlug: string): Promise<WorkspaceMemberResponse[]> {
    const userId = '00000000-0000-0000-0000-000000000000'; // TODO: 로그인 유저 ID로 교체
    const member = await this.findMemberOrThrow(workspaceSlug, userId);

    const memberList = await this.db
      .select({
        handle: userProfiles.handle,
        nickname: userProfiles.nickname,
        profileImageId: userProfiles.profileImageId,
        role: workspace_members.role,
        joinedAt: workspace_members.joinedAt,
      })
      .from(workspace_members)
      .innerJoin(userProfiles, eq(workspace_members.userId, userProfiles.userId))
      .where(eq(workspace_members.workspaceId, member.workspaceId));

    return memberList.map((m) => ({
      handle: m.handle,
      nickname: m.nickname ?? '',
      profileImageId: m.profileImageId,
      role: m.role,
      joinedAt: m.joinedAt.toISOString(),
    }));
  }

  async kickMemberFromWorkspace(workspaceSlug: string, targetHandle: string): Promise<void> {
    const userId = '00000000-0000-0000-0000-000000000000'; // TODO: 로그인 유저 ID로 교체
    const actor = await this.findMemberOrThrow(workspaceSlug, userId);

    // Admin 이상만 방출 가능
    if (actor.role !== EWorkspaceUserRole.OWNER && actor.role !== EWorkspaceUserRole.ADMIN) {
      throw new ForbiddenException('멤버를 방출할 권한이 없습니다.');
    }

    const target = await this.findMemberByHandleOrThrow(actor.workspaceId, targetHandle);

    // 본인 방출은 leave API로만 처리(의도적 분리)
    if (target.userId === userId) {
      throw new BadRequestException('본인은 방출할 수 없습니다. 탈퇴 기능을 이용해주세요.');
    }

    // 동급 이상의 권한을 가진 멤버는 방출 불가
    if (ROLE_RANK[actor.role] >= ROLE_RANK[target.role]) {
      throw new ForbiddenException('동급 이상의 권한을 가진 멤버는 방출할 수 없습니다.');
    }

    await this.db
      .delete(workspace_members)
      .where(
        and(
          eq(workspace_members.workspaceId, actor.workspaceId),
          eq(workspace_members.userId, target.userId),
        ),
      );
  }

  private async findMemberByHandleOrThrow(workspaceId: string, handle: string) {
    const [target] = await this.db
      .select({ userId: workspace_members.userId, role: workspace_members.role })
      .from(workspace_members)
      .innerJoin(userProfiles, eq(workspace_members.userId, userProfiles.userId))
      .where(and(eq(workspace_members.workspaceId, workspaceId), eq(userProfiles.handle, handle)));

    if (!target) {
      throw new NotFoundException('존재하지 않는 멤버입니다.');
    }

    return target;
  }

  async updateMemberRole(
    workspaceSlug: string,
    targetHandle: string,
    dto: UpdateMemberRoleRequest,
  ): Promise<void> {
    const userId = '00000000-0000-0000-0000-000000000000'; // TODO: 로그인 유저 ID로 교체
    const actor = await this.findMemberOrThrow(workspaceSlug, userId);

    // Admin 이상만 역할 변경 가능
    if (actor.role !== EWorkspaceUserRole.OWNER && actor.role !== EWorkspaceUserRole.ADMIN) {
      throw new ForbiddenException('멤버 역할을 변경할 권한이 없습니다.');
    }

    // Owner 권한은 delegateOwner로만 변경 가능
    if (dto.role === EWorkspaceUserRole.OWNER) {
      throw new BadRequestException('Owner 권한은 소유권 위임 API를 통해서만 변경할 수 있습니다.');
    }

    const target = await this.findMemberByHandleOrThrow(actor.workspaceId, targetHandle);

    if (target.userId === userId) {
      throw new BadRequestException('본인의 역할은 변경할 수 없습니다.');
    }

    if (ROLE_RANK[actor.role] >= ROLE_RANK[target.role]) {
      throw new ForbiddenException('동급 이상의 권한을 가진 멤버는 변경할 수 없습니다.');
    }

    await this.db
      .update(workspace_members)
      .set({ role: dto.role })
      .where(
        and(
          eq(workspace_members.workspaceId, actor.workspaceId),
          eq(workspace_members.userId, target.userId),
        ),
      );
  }

  async leaveWorkspace(workspaceSlug: string): Promise<void> {
    const userId = '00000000-0000-0000-0000-000000000000'; // TODO: 로그인 유저 ID로 교체
    const actor = await this.findMemberOrThrow(workspaceSlug, userId);

    // Owner가 위임 없이 탈퇴 시도 시 차단
    if (actor.role === EWorkspaceUserRole.OWNER) {
      throw new BadRequestException('Owner 권한을 다른 멤버에게 위임해야 합니다.');
    }

    await this.db
      .delete(workspace_members)
      .where(
        and(
          eq(workspace_members.workspaceId, actor.workspaceId),
          eq(workspace_members.userId, userId),
        ),
      );
  }

  async delegateOwner(workspaceSlug: string, dto: DelegateOwnerRequest): Promise<void> {
    const userId = '00000000-0000-0000-0000-000000000000'; // TODO: 로그인 유저 ID로 교체
    const actor = await this.findMemberOrThrow(workspaceSlug, userId);

    // Owner만 소유권 위임 가능
    if (actor.role !== EWorkspaceUserRole.OWNER) {
      throw new ForbiddenException('소유권 위임은 Owner만 할 수 있습니다.');
    }

    const newOwner = await this.findMemberByHandleOrThrow(actor.workspaceId, dto.newOwnerHandle);

    if (newOwner.userId === userId) {
      throw new BadRequestException('본인에게는 소유권을 위임할 수 없습니다.');
    }

    // 소유권 위임 시 기존 Owner는 Admin으로 강등
    await this.db.transaction(async (tx) => {
      await tx
        .update(workspace_members)
        .set({ role: EWorkspaceUserRole.ADMIN })
        .where(
          and(
            eq(workspace_members.workspaceId, actor.workspaceId),
            eq(workspace_members.userId, userId),
          ),
        );

      await tx
        .update(workspace_members)
        .set({ role: EWorkspaceUserRole.OWNER })
        .where(
          and(
            eq(workspace_members.workspaceId, actor.workspaceId),
            eq(workspace_members.userId, newOwner.userId),
          ),
        );
    });
  }

  private async findMemberOrThrow(workspaceSlug: string, userId: string) {
    const [member] = await this.db
      .select({ role: workspace_members.role, workspaceId: workspaces.id })
      .from(workspaces)
      .innerJoin(workspace_members, eq(workspaces.id, workspace_members.workspaceId))
      .where(and(eq(workspaces.slug, workspaceSlug), eq(workspace_members.userId, userId)));

    if (!member) {
      throw new NotFoundException('존재하지 않는 워크스페이스이거나 접근 권한이 없습니다.');
    }

    return member;
  }
}

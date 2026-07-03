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
import { canManage } from './utils/role.util';

import { DB_CONNECTION } from '@/common/constants';
import { type DrizzleDB } from '@/database/drizzle.module';
import { userProfiles, workspaceMembers, workspaces } from '@/database/schema';

@Injectable()
export class WorkspaceMembersService {
  constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}

  async getWorkspaceMemberList(
    workspaceSlug: string,
    userId: string,
  ): Promise<WorkspaceMemberResponse[]> {
    const member = await this.findMemberOrThrow(workspaceSlug, userId);

    const memberList = await this.db
      .select({
        handle: userProfiles.handle,
        nickname: userProfiles.nickname,
        profileImageId: userProfiles.profileImageId,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
      })
      .from(workspaceMembers)
      .innerJoin(userProfiles, eq(workspaceMembers.userId, userProfiles.userId))
      .where(eq(workspaceMembers.workspaceId, member.workspaceId));

    return memberList.map((m) => ({
      handle: m.handle,
      nickname: m.nickname ?? '',
      profileImageId: m.profileImageId,
      role: m.role,
      joinedAt: m.joinedAt.toISOString(),
    }));
  }

  async kickMemberFromWorkspace(
    workspaceSlug: string,
    targetHandle: string,
    userId: string,
  ): Promise<void> {
    const actor = await this.findMemberOrThrow(workspaceSlug, userId);

    // MEMBER보다 높은 권한(ADMIN, OWNER)만 통과시키기 위한 기준값 비교
    if (!canManage(actor.role, EWorkspaceUserRole.MEMBER)) {
      throw new ForbiddenException('멤버를 방출할 권한이 없습니다.');
    }

    const target = await this.findMemberByHandleOrThrow(actor.workspaceId, targetHandle);

    // 본인 방출은 leave API로만 처리(의도적 분리)
    if (target.userId === userId) {
      throw new BadRequestException('본인은 방출할 수 없습니다. 탈퇴 기능을 이용해주세요.');
    }

    // 동급 이상의 권한을 가진 멤버는 방출 불가
    if (!canManage(actor.role, target.role)) {
      throw new ForbiddenException('동급 이상의 권한을 가진 멤버는 방출할 수 없습니다.');
    }

    await this.db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, actor.workspaceId),
          eq(workspaceMembers.userId, target.userId),
        ),
      );
  }

  private async findMemberByHandleOrThrow(workspaceId: string, handle: string) {
    const [target] = await this.db
      .select({ userId: workspaceMembers.userId, role: workspaceMembers.role })
      .from(workspaceMembers)
      .innerJoin(userProfiles, eq(workspaceMembers.userId, userProfiles.userId))
      .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(userProfiles.handle, handle)));

    if (!target) {
      throw new NotFoundException('존재하지 않는 멤버입니다.');
    }

    return target;
  }

  async updateMemberRole(
    workspaceSlug: string,
    targetHandle: string,
    dto: UpdateMemberRoleRequest,
    userId: string,
  ): Promise<void> {
    const actor = await this.findMemberOrThrow(workspaceSlug, userId);

    // MEMBER보다 높은 권한(ADMIN, OWNER)만 역할 변경 가능
    if (!canManage(actor.role, EWorkspaceUserRole.MEMBER)) {
      throw new ForbiddenException('멤버 역할을 변경할 권한이 없습니다.');
    }

    if (!canManage(actor.role, dto.role)) {
      // OWNER로 변경 시도한 경우 별도 안내
      if (dto.role === EWorkspaceUserRole.OWNER) {
        throw new BadRequestException(
          'Owner 권한은 소유권 위임 API를 통해서만 변경할 수 있습니다.',
        );
      }
      throw new BadRequestException('본인의 권한 이상으로는 역할을 변경할 수 없습니다.');
    }

    const target = await this.findMemberByHandleOrThrow(actor.workspaceId, targetHandle);

    if (target.userId === userId) {
      throw new BadRequestException('본인의 역할은 변경할 수 없습니다.');
    }

    if (!canManage(actor.role, target.role)) {
      throw new ForbiddenException('동급 이상의 권한을 가진 멤버는 변경할 수 없습니다.');
    }

    await this.db
      .update(workspaceMembers)
      .set({ role: dto.role })
      .where(
        and(
          eq(workspaceMembers.workspaceId, actor.workspaceId),
          eq(workspaceMembers.userId, target.userId),
        ),
      );
  }

  async leaveWorkspace(workspaceSlug: string, userId: string): Promise<void> {
    const actor = await this.findMemberOrThrow(workspaceSlug, userId);

    // Owner가 위임 없이 탈퇴 시도 시 차단
    if (actor.role === EWorkspaceUserRole.OWNER) {
      throw new BadRequestException('Owner 권한을 다른 멤버에게 위임해야 합니다.');
    }

    await this.db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, actor.workspaceId),
          eq(workspaceMembers.userId, userId),
        ),
      );
  }

  async delegateOwner(
    workspaceSlug: string,
    dto: DelegateOwnerRequest,
    userId: string,
  ): Promise<void> {
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
        .update(workspaceMembers)
        .set({ role: EWorkspaceUserRole.ADMIN })
        .where(
          and(
            eq(workspaceMembers.workspaceId, actor.workspaceId),
            eq(workspaceMembers.userId, userId),
          ),
        );

      await tx
        .update(workspaceMembers)
        .set({ role: EWorkspaceUserRole.OWNER })
        .where(
          and(
            eq(workspaceMembers.workspaceId, actor.workspaceId),
            eq(workspaceMembers.userId, newOwner.userId),
          ),
        );
    });
  }

  private async findMemberOrThrow(workspaceSlug: string, userId: string) {
    const [member] = await this.db
      .select({ role: workspaceMembers.role, workspaceId: workspaces.id })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(and(eq(workspaces.slug, workspaceSlug), eq(workspaceMembers.userId, userId)));

    if (!member) {
      throw new NotFoundException('존재하지 않는 워크스페이스이거나 접근 권한이 없습니다.');
    }

    return member;
  }
}

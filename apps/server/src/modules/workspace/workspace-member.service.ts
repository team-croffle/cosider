import { randomBytes } from 'crypto';

import { EWorkspaceUserRole } from '@cosider/shared';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, gt, isNull } from 'drizzle-orm';

import {
  DelegateOwnerRequest,
  MemberInvitationResponse,
  MemberInviteRequest,
  UpdateMemberRoleRequest,
  WorkspaceMemberResponse,
} from './dto';
import { canManage, isOwner } from './utils/role.util';

import { DB_CONNECTION } from '@/common/constants';
import { MailService } from '@/common/mail/mail.service';
import { type DrizzleDB } from '@/database/drizzle.module';
import { userProfiles, users, workspaceInvitations, workspaceMembers } from '@/database/schema';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: DrizzleDB,
    private readonly mailService: MailService,
  ) {}

  async getWorkspaceMemberList(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceMemberResponse[]> {
    const member = await this.findMemberOrThrow(workspaceId, userId);

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
    workspaceId: string,
    targetUserId: string,
    userId: string,
  ): Promise<void> {
    const actor = await this.findMemberOrThrow(workspaceId, userId);

    // MEMBER보다 높은 권한(ADMIN, OWNER)만 통과시키기 위한 기준값 비교
    if (!canManage(actor.role, EWorkspaceUserRole.MEMBER)) {
      throw new ForbiddenException('멤버를 방출할 권한이 없습니다.');
    }

    const target = await this.findMemberByIdOrThrow(actor.workspaceId, targetUserId);

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

  async updateMemberRole(
    workspaceId: string,
    targetUserId: string,
    dto: UpdateMemberRoleRequest,
    userId: string,
  ): Promise<void> {
    const actor = await this.findMemberOrThrow(workspaceId, userId);

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

    const target = await this.findMemberByIdOrThrow(actor.workspaceId, targetUserId);

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

  async leaveWorkspace(workspaceId: string, userId: string): Promise<void> {
    const actor = await this.findMemberOrThrow(workspaceId, userId);

    // Owner가 위임 없이 탈퇴 시도 시 차단
    if (isOwner(actor.role)) {
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
    workspaceId: string,
    dto: DelegateOwnerRequest,
    userId: string,
  ): Promise<void> {
    const actor = await this.findMemberOrThrow(workspaceId, userId);

    if (!isOwner(actor.role)) {
      throw new ForbiddenException('소유권 위임은 Owner만 할 수 있습니다.');
    }

    const [newOwner] = await this.db
      .select({ userId: workspaceMembers.userId })
      .from(workspaceMembers)
      .innerJoin(userProfiles, eq(workspaceMembers.userId, userProfiles.userId))
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(userProfiles.handle, dto.newOwnerHandle),
        ),
      );

    if (!newOwner) {
      throw new NotFoundException('존재하지 않는 멤버입니다.');
    }

    if (newOwner.userId === userId) {
      throw new BadRequestException('본인에게는 소유권을 위임할 수 없습니다.');
    }

    // 소유권 위임 시 기존 Owner는 Admin으로 강등
    await this.db.transaction(async (tx) => {
      await tx
        .update(workspaceMembers)
        .set({ role: EWorkspaceUserRole.ADMIN })
        .where(
          and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)),
        );

      await tx
        .update(workspaceMembers)
        .set({ role: EWorkspaceUserRole.OWNER })
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, newOwner.userId),
          ),
        );
    });
  }

  // Member Invitation methods
  async inviteMember(
    workspaceId: string,
    dto: MemberInviteRequest,
    userId: string,
  ): Promise<MemberInvitationResponse> {
    const actor = await this.findMemberOrThrow(workspaceId, userId);

    // MEMBER보다 높은 권한(ADMIN, OWNER)만 멤버 초대 가능
    if (!canManage(actor.role, EWorkspaceUserRole.MEMBER)) {
      throw new ForbiddenException('멤버를 초대할 권한이 없습니다.');
    }

    // OWNER 역할로는 초대할 수 없도록 제한
    if (dto.role === EWorkspaceUserRole.OWNER) {
      throw new ForbiddenException('OWNER 역할로는 초대할 수 없습니다.');
    }

    const isEmail = dto.target.includes('@');
    let targetUserId: string | null = null;

    if (isEmail) {
      const [user] = await this.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, dto.target));

      if (user) targetUserId = user.id;
    } else {
      const [profile] = await this.db
        .select({ userId: userProfiles.userId })
        .from(userProfiles)
        .where(eq(userProfiles.handle, dto.target));

      if (!profile) throw new NotFoundException('존재하지 않는 사용자입니다.');
      targetUserId = profile.userId;
    }

    if (targetUserId) {
      const [existing] = await this.db
        .select({ id: workspaceMembers.id })
        .from(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.workspaceId, workspaceId),
            eq(workspaceMembers.userId, targetUserId),
          ),
        );

      if (existing) throw new ConflictException('이미 워크스페이스에 소속된 멤버입니다.');
    }

    const [pending] = await this.db
      .select({ id: workspaceInvitations.id })
      .from(workspaceInvitations)
      .where(
        and(
          eq(workspaceInvitations.workspaceId, workspaceId),
          eq(workspaceInvitations.target, dto.target),
          isNull(workspaceInvitations.acceptedAt),
          gt(workspaceInvitations.expiresAt, new Date()),
        ),
      );

    if (pending) throw new ConflictException('이미 대기 중인 초대가 있습니다.');

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

    const [invitation] = await this.db
      .insert(workspaceInvitations)
      .values({
        workspaceId,
        inviterId: userId,
        target: dto.target,
        token,
        role: dto.role,
        expiresAt,
      })
      .returning();

    const [inviter] = await this.db
      .select({
        userId: userProfiles.userId,
        handle: userProfiles.handle,
        nickname: userProfiles.nickname,
        profileImageId: userProfiles.profileImageId,
        updatedAt: userProfiles.updatedAt,
        handleUpdatedAt: userProfiles.handleUpdatedAt,
      })
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    const targetEmail = isEmail
      ? dto.target
      : targetUserId
        ? await this.db
            .select({ email: users.email })
            .from(users)
            .where(eq(users.id, targetUserId))
            .then(([u]) => u?.email)
        : null;

    if (targetEmail) {
      try {
        await this.mailService.sendInvitationMail(targetEmail, token);
      } catch (error) {
        await this.db
          .delete(workspaceInvitations)
          .where(eq(workspaceInvitations.id, invitation.id));
        throw error;
      }
    }

    return new MemberInvitationResponse({
      id: invitation.id,
      inviter: {
        userId: inviter.userId!,
        handle: inviter.handle,
        nickname: inviter.nickname,
        profileImageId: inviter.profileImageId,
        updatedAt: inviter.updatedAt?.toISOString() ?? null,
        handleUpdatedAt: inviter.handleUpdatedAt?.toISOString() ?? null,
      },
      target: invitation.target,
      role: invitation.role,
      createdAt: invitation.createdAt.toISOString(),
      expiresAt: invitation.expiresAt.toISOString(),
      acceptedAt: invitation.acceptedAt?.toISOString() ?? null,
    });
  }

  async getInvitationList(
    workspaceId: string,
    userId: string,
  ): Promise<MemberInvitationResponse[]> {
    const actor = await this.findMemberOrThrow(workspaceId, userId);

    // MEMBER보다 높은 권한(ADMIN, OWNER)만 초대 목록 조회 가능
    if (!canManage(actor.role, EWorkspaceUserRole.MEMBER)) {
      throw new ForbiddenException('초대 목록을 조회할 권한이 없습니다.');
    }

    const invitations = await this.db
      .select({
        id: workspaceInvitations.id,
        target: workspaceInvitations.target,
        role: workspaceInvitations.role,
        createdAt: workspaceInvitations.createdAt,
        expiresAt: workspaceInvitations.expiresAt,
        acceptedAt: workspaceInvitations.acceptedAt,
        inviterUserId: userProfiles.userId,
        inviterHandle: userProfiles.handle,
        inviterNickname: userProfiles.nickname,
        inviterProfileImageId: userProfiles.profileImageId,
        inviterUpdatedAt: userProfiles.updatedAt,
        inviterHandleUpdatedAt: userProfiles.handleUpdatedAt,
      })
      .from(workspaceInvitations)
      .innerJoin(userProfiles, eq(workspaceInvitations.inviterId, userProfiles.userId))
      .where(
        and(
          eq(workspaceInvitations.workspaceId, actor.workspaceId),
          isNull(workspaceInvitations.acceptedAt),
          gt(workspaceInvitations.expiresAt, new Date()), // 만료 안 된 것만
        ),
      );

    return invitations.map(
      (inv) =>
        new MemberInvitationResponse({
          id: inv.id,
          inviter: {
            userId: inv.inviterUserId!,
            handle: inv.inviterHandle,
            nickname: inv.inviterNickname,
            profileImageId: inv.inviterProfileImageId,
            updatedAt: inv.inviterUpdatedAt?.toISOString() ?? null,
            handleUpdatedAt: inv.inviterHandleUpdatedAt?.toISOString() ?? null,
          },
          target: inv.target,
          role: inv.role,
          createdAt: inv.createdAt.toISOString(),
          expiresAt: inv.expiresAt.toISOString(),
          acceptedAt: inv.acceptedAt?.toISOString() ?? null,
        }),
    );
  }

  async cancelMemberInvitation(
    workspaceId: string,
    invitationId: string,
    userId: string,
  ): Promise<void> {
    const actor = await this.findMemberOrThrow(workspaceId, userId);

    // MEMBER보다 높은 권한(ADMIN, OWNER)만 초대 취소 가능
    if (!canManage(actor.role, EWorkspaceUserRole.MEMBER)) {
      throw new ForbiddenException('초대를 취소할 권한이 없습니다.');
    }

    const [invitation] = await this.db
      .select({ id: workspaceInvitations.id, expiresAt: workspaceInvitations.expiresAt })
      .from(workspaceInvitations)
      .where(
        and(
          eq(workspaceInvitations.id, invitationId),
          eq(workspaceInvitations.workspaceId, actor.workspaceId),
        ),
      );

    if (!invitation) {
      throw new NotFoundException('존재하지 않는 초대입니다.');
    }

    if (invitation.expiresAt < new Date()) {
      throw new GoneException('이미 만료된 초대입니다.');
    }

    await this.db
      .update(workspaceInvitations)
      .set({ expiresAt: new Date() })
      .where(eq(workspaceInvitations.id, invitationId));
  }

  // Helper methods
  private async findMemberOrThrow(workspaceId: string, userId: string) {
    const [member] = await this.db
      .select({ role: workspaceMembers.role, workspaceId: workspaceMembers.workspaceId })
      .from(workspaceMembers)
      .where(
        and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)),
      );

    if (!member) {
      throw new NotFoundException('존재하지 않는 워크스페이스이거나 접근 권한이 없습니다.');
    }

    return member;
  }

  private async findMemberByIdOrThrow(workspaceId: string, targetUserId: string) {
    const [target] = await this.db
      .select({ userId: workspaceMembers.userId, role: workspaceMembers.role })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, targetUserId),
        ),
      );

    if (!target) {
      throw new NotFoundException('존재하지 않는 멤버입니다.');
    }

    return target;
  }
}

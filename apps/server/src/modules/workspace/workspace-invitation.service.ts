import {
  Injectable,
  Inject,
  NotFoundException,
  GoneException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { DB_CONNECTION } from '@/common/constants';
import { type DrizzleDB } from '@/database/drizzle.module';
import { users, userProfiles, workspaceMembers, workspaceInvitations } from '@/database/schema';
import type { AuthenticatedUser } from '@/types/auth/auth.type';

@Injectable()
export class WorkspaceInvitationsService {
  constructor(@Inject(DB_CONNECTION) private readonly db: DrizzleDB) {}

  async checkInvitation(token: string): Promise<void> {
    await this.findValidInvitationOrThrow(token);
  }

  async acceptInvitation(token: string, user: AuthenticatedUser): Promise<void> {
    const invitation = await this.findValidInvitationOrThrow(token);

    // 이미 워크스페이스에 소속된 멤버인지 확인
    const [existingMember] = await this.db
      .select({ id: workspaceMembers.id })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, invitation.workspaceId!),
          eq(workspaceMembers.userId, user.userId),
        ),
      );

    if (existingMember) throw new ConflictException('이미 워크스페이스에 소속된 멤버입니다.');

    const isEmail = invitation.target.includes('@');

    if (isEmail) {
      const [targetUser] = await this.db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, user.userId));

      if (targetUser?.email !== invitation.target) {
        throw new UnauthorizedException('초대받은 대상이 아닙니다.');
      }
    } else {
      const [profile] = await this.db
        .select({ handle: userProfiles.handle })
        .from(userProfiles)
        .where(eq(userProfiles.userId, user.userId));

      if (profile?.handle !== invitation.target) {
        throw new UnauthorizedException('초대받은 대상이 아닙니다.');
      }
    }

    // 트랜잭션으로 멤버 추가 + acceptedAt 업데이트
    await this.db.transaction(async (tx) => {
      await tx.insert(workspaceMembers).values({
        workspaceId: invitation.workspaceId!,
        userId: user.userId,
        role: invitation.role,
      });

      await tx
        .update(workspaceInvitations)
        .set({ acceptedAt: new Date() })
        .where(eq(workspaceInvitations.token, token));
    });
  }

  // Helper Methods
  private async findValidInvitationOrThrow(token: string) {
    const [invitation] = await this.db
      .select()
      .from(workspaceInvitations)
      .where(eq(workspaceInvitations.token, token));

    if (!invitation) throw new NotFoundException('존재하지 않는 초대입니다.');

    if (invitation.expiresAt < new Date()) {
      throw new GoneException('만료된 초대 링크입니다.');
    }

    if (invitation.acceptedAt) {
      throw new GoneException('이미 수락된 초대입니다.');
    }

    if (!invitation.workspaceId) {
      throw new GoneException('유효하지 않은 초대입니다.');
    }

    return invitation;
  }
}

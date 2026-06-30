import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { UserProfileResponse } from './dto';

import { DB_CONNECTION } from '@/common/constants';
import { UNAVAILABLE_HANDLES } from '@/common/constants/user.const';
import { CheckExistsResponse } from '@/common/model';
import type { DrizzleDB } from '@/database/drizzle.module';
import { userProfiles, users } from '@/database/schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: DrizzleDB,
  ) {}

  // 프로필 조회
  async getProfile(userId: string): Promise<UserProfileResponse> {
    const [profile] = await this.db
      .select({
        handle: userProfiles.handle,
        nickname: userProfiles.nickname,
        techStacks: userProfiles.techStacks,
        jobRole: userProfiles.jobRole,
        profileImageId: userProfiles.profileImageId,
      })
      .from(users)
      .innerJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    // 프로필이 없을 경우 404 반환
    if (!profile) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return profile;
  }

  async checkHandleExists(handle: string): Promise<CheckExistsResponse> {
    if (UNAVAILABLE_HANDLES.has(handle.toLowerCase())) {
      return { isAvailable: false };
    }

    const [profile] = await this.db
      .select({ id: userProfiles.id })
      .from(userProfiles)
      .where(eq(userProfiles.handle, handle))
      .limit(1);

    return {
      isAvailable: !profile,
    };
  }
}

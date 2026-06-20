import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { CheckHandleExistsResponse, UserProfileResponse } from './dto';

import { DB_CONNECTION } from '@/common/constants';
import type { DrizzleDB } from '@/database/drizzle.module';
import { userProfiles, users } from '@/database/schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: DrizzleDB,
  ) {}

  async getProfile(handle: string): Promise<UserProfileResponse> {
    // 1. Drizzle ORM 프로필 단건 조회
    const [profile] = await this.db
      .select()
      .from(users)
      .innerJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(userProfiles.handle, handle))
      .limit(1);

    if (!profile) {
      throw new NotFoundException(`해당 핸들(${handle})을 가진 사용자를 찾을 수 없습니다.`);
    }

    // 3. DTO 반환
    return {
      handle: profile.user_profiles.handle,
      email: profile.users.email,
      nickname: profile.user_profiles.nickname ?? '',
      profileImageId: profile.user_profiles.profileImageId,
      techStacks: profile.user_profiles.techStacks as string[] | null,
      jobRole: profile.user_profiles.jobRole,
    };
  }

  checkHandleExists(handle: string): CheckHandleExistsResponse {
    // mock data
    const unavailableHandles = ['admin', 'root'];

    return {
      isAvailable: !unavailableHandles.includes(handle),
    };
  }
}

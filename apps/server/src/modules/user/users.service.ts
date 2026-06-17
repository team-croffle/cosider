import { EJobRole } from '@cosider/shared';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { CheckHandleExistsResponse, UserProfileResponse } from './dto';

import { DB_CONNECTION } from '@/common/constants';
import type { DrizzleDB } from '@/database/drizzle.module';
import { userProfiles } from '@/database/schema/user.schema';

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
      .from(userProfiles)
      .where(eq(userProfiles.handle, handle))
      .limit(1);

    if (!profile) {
      throw new NotFoundException(`해당 핸들(${handle})을 가진 사용자를 찾을 수 없습니다.`);
    }

    // 3. DTO 반환
    return {
      handle: profile.handle,
      email: profile.email,
      nickname: profile.nickname ?? '',
      profileImageId: profile.profileImageId,
      techStacks: profile.techStacks as string[] | null,
      jobRole: profile.jobRole as EJobRole,
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

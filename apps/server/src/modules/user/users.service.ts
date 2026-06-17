import { EJobRole } from '@cosider/shared';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';

import { MinioService } from '../../common/minio/minio.service';
import { DB_CONNECTION } from '../../database/drizzle.module';
import type { DrizzleDB } from '../../database/drizzle.module';
import { userProfiles } from '../../database/schema/user.schema';

import { CheckHandleExistsResponse, UserProfileResponse } from './dto';

@Injectable()
export class UsersService {
  private readonly minioBucket: string;

  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: DrizzleDB,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.minioBucket = this.configService.get<string>('STORAGE_BUCKET_NAME') ?? 'cosider-bucket';
  }
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

    // 2. MinioService를 통해 임시 다운로드 URL 추출
    let profileImageUrl: string | null = null;

    if (profile.profileImageKey) {
      const { downloadUrl } = await this.minioService.getPresignedDownloadUrl(
        this.minioBucket,
        profile.profileImageKey,
      );
      profileImageUrl = downloadUrl;
    }

    // 3. DTO 반환
    return {
      handle: profile.handle,
      email: profile.email,
      nickname: profile.nickname ?? '',
      profileImageUrl: profileImageUrl,
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

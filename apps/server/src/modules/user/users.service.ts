import { IUserProfile } from '@cosider/shared';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { UserProfileDetailResponse, UserProfileResponse, UserProfileUpdateRequest } from './dto';
import { CreateProfileRequest } from './dto/create-profile-req.dto';

import { DB_CONNECTION } from '@/common/constants';
import { UNAVAILABLE_HANDLES } from '@/common/constants/user.const';
import { FileUploadCompletionRequest } from '@/common/file/dto/file-upload-completion.dto';
import { FilesService } from '@/common/file/files.service';
import { CheckExistsResponse } from '@/common/model';
import type { DrizzleDB, DrizzleTx } from '@/database/drizzle.module';
import { userProfiles, users } from '@/database/schema/user.schema';
import { FileContext, PreparedUpload } from '@/types/file';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: DrizzleDB,
    private readonly fileService: FilesService,
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

  async getProfileDetail(userId: string): Promise<UserProfileDetailResponse> {
    const [profile] = await this.db.transaction(async (tx) => {
      return this.profileDetailTransaction(tx, userId);
    });

    if (!profile) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return this.mapProfileDetail(profile);
  }

  async createProfile(
    userId: string,
    dto: CreateProfileRequest,
  ): Promise<UserProfileDetailResponse> {
    if (UNAVAILABLE_HANDLES.has(dto.handle.toLowerCase())) {
      throw new BadRequestException('UNAVAILABLE_HANDLE');
    }

    let prepared: PreparedUpload | null = null;

    if (dto.uploadToken) {
      prepared = await this.fileService.prepareUpload(
        userId,
        dto.uploadToken,
        (ctx) =>
          this.fileService.buildPermanentObjectKey(
            `users/${userId}`,
            ctx.fileId,
            this.fileService.extractExt(ctx.fileName),
          ),
        {
          maxFileSize: 1024 * 1024 * 10, // 10MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
      );
    }

    const context: FileContext = {
      id: userId, // "Context ID" === User ID
    };

    try {
      const profile = await this.db.transaction(async (tx) => {
        const [exists] = await tx
          .select({ id: userProfiles.id })
          .from(userProfiles)
          .where(eq(userProfiles.userId, userId))
          .limit(1);
        if (exists) {
          throw new BadRequestException('USER_PROFILE_ALREADY_EXISTS');
        }

        const [handleExists] = await tx
          .select({ id: userProfiles.id })
          .from(userProfiles)
          .where(eq(userProfiles.handle, dto.handle))
          .limit(1);
        if (handleExists) {
          throw new BadRequestException('HANDLE_ALREADY_EXISTS');
        }

        let fileId: string | null = null;
        if (prepared) {
          fileId = await this.fileService.insertPreparedFile(tx, prepared, context);
        }

        await tx.insert(userProfiles).values({
          userId,
          handle: dto.handle,
          nickname: dto.nickname,
          techStacks: dto.techStacks,
          jobRole: dto.jobRole,
          profileImageId: fileId,
        });

        const [profile] = await this.profileDetailTransaction(tx, userId);
        if (!profile) {
          throw new NotFoundException('USER_PROFILE_NOT_FOUND');
        }

        return profile;
      });

      if (prepared) {
        await this.fileService.completeUpload(prepared);
      }

      return this.mapProfileDetail(profile);
    } catch (error) {
      if (prepared) {
        await this.fileService.rollbackUpload(prepared);
      }
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    dto: UserProfileUpdateRequest,
  ): Promise<UserProfileDetailResponse> {
    if (!dto.nickname && !dto.techStacks && !dto.jobRole) {
      throw new BadRequestException('NO_CHANGES_MADE');
    }

    const profile = await this.db.transaction(async (tx) => {
      const [exists] = await tx
        .select({ id: userProfiles.id })
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);
      if (!exists) {
        throw new NotFoundException('USER_PROFILE_NOT_FOUND');
      }

      const [updatedProfile] = await tx
        .update(userProfiles)
        .set({
          nickname: dto.nickname,
          techStacks: dto.techStacks,
          jobRole: dto.jobRole,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId))
        .returning({ userId: userProfiles.userId });
      if (!updatedProfile) {
        throw new NotFoundException('USER_PROFILE_NOT_FOUND');
      }

      const [profile] = await this.profileDetailTransaction(tx, userId);
      if (!profile) {
        throw new NotFoundException('USER_PROFILE_NOT_FOUND');
      }

      return profile;
    });

    return this.mapProfileDetail(profile);
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

  async updateMyProfileAvatar(
    userId: string,
    dto: FileUploadCompletionRequest,
  ): Promise<UserProfileDetailResponse> {
    if (!dto.uploadToken) {
      throw new BadRequestException('UPLOAD_TOKEN_REQUIRED');
    }

    const prepared = await this.fileService.prepareUpload(
      userId,
      dto.uploadToken,
      (ctx) =>
        this.fileService.buildPermanentObjectKey(
          `users/${userId}`,
          ctx.fileId,
          this.fileService.extractExt(ctx.fileName),
        ),
      {
        maxFileSize: 1024 * 1024 * 10, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      },
    );

    const context: FileContext = {
      id: userId, // "Context ID" === User ID
    };

    try {
      const updatedProfile = await this.db.transaction(async (tx) => {
        await this.fileService.insertPreparedFile(tx, prepared, context);

        const [updated] = await tx
          .update(userProfiles)
          .set({
            profileImageId: prepared.fileId,
          })
          .where(eq(userProfiles.userId, userId))
          .returning({ userId: userProfiles.userId });
        if (!updated) {
          throw new NotFoundException('USER_PROFILE_NOT_FOUND');
        }

        const [profile] = await this.profileDetailTransaction(tx, userId);
        if (!profile) {
          throw new NotFoundException('USER_PROFILE_NOT_FOUND');
        }

        return this.mapProfileDetail(profile);
      });

      await this.fileService.completeUpload(prepared);
      return updatedProfile;
    } catch (error) {
      await this.fileService.rollbackUpload(prepared);
      throw error;
    }
  }

  // Helper Methods
  private profileDetailTransaction(tx: DrizzleTx, userId: string) {
    return tx
      .select({
        email: users.email,
        handle: userProfiles.handle,
        nickname: userProfiles.nickname,
        profileImageId: userProfiles.profileImageId,
        techStacks: userProfiles.techStacks,
        jobRole: userProfiles.jobRole,
        updatedAt: userProfiles.updatedAt,
        handleUpdatedAt: userProfiles.handleUpdatedAt,
      })
      .from(users)
      .innerJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(userProfiles.userId, userId))
      .limit(1);
  }

  private mapProfileDetail(
    profile: Omit<IUserProfile, 'id' | 'userId'> & { email: string },
  ): UserProfileDetailResponse {
    return {
      email: profile.email,
      handle: profile.handle,
      nickname: profile.nickname,
      profileImageId: profile.profileImageId,
      techStacks: profile.techStacks,
      jobRole: profile.jobRole,
      updatedAt: profile.updatedAt?.toISOString() ?? null,
      handleUpdatedAt: profile.handleUpdatedAt?.toISOString() ?? null,
    };
  }
}

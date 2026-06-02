import { Injectable } from '@nestjs/common';

import { UserProfileResponseDto, CheckHandleExistsResponseDto, EJobRole } from '@cosider/shared';

@Injectable()
export class UsersService {
  getProfile(
    handle: string,
  ): UserProfileResponseDto {
    // mock data
    return {
      handle,
      nickname: 'Maple',
      profile_image_url: null,
      tech_stacks: ['Java', 'Spring'],
      job_role: EJobRole.BE_DEV,
    };
  }

  checkHandleExists(
    handle: string,
  ): CheckHandleExistsResponseDto {
    // mock data
    const unavailableHandles = [
      'admin',
      'root',
    ];

    return {
      is_available: !unavailableHandles.includes(handle),
    };
  }
}

import { Injectable } from '@nestjs/common';

import { UserProfileResponseDto, EJobRole } from '@cosider/shared';

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
}

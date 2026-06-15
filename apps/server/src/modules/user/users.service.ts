import { EJobRole } from '@cosider/shared';
import { Injectable } from '@nestjs/common';

import { CheckHandleExistsResponse, UserProfileResponse } from './dto';

@Injectable()
export class UsersService {
  getProfile(handle: string): UserProfileResponse {
    // mock data
    return {
      handle,
      nickname: 'Maple',
      profileImageUrl: null,
      techStacks: ['Java', 'Spring'],
      jobRole: EJobRole.BE_DEV,
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

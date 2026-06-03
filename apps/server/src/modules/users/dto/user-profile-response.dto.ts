import { EJobRole, IUserProfileResponse } from '@cosider/shared';

export class UserProfileResponse implements IUserProfileResponse {
  handle!: string;
  nickname!: string;
  profileImageUrl!: string | null;
  techStacks!: string[] | null;
  jobRole!: EJobRole;
}

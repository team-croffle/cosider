import { EJobRole, IUserProfileResponse } from '@cosider/shared';

export class UserProfileResponse implements IUserProfileResponse {
  handle!: string;
  email!: string;
  nickname!: string;
  profileImageId!: string | null;
  techStacks!: string[] | null;
  jobRole!: EJobRole;
}

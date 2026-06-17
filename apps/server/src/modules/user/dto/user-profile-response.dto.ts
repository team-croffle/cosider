import { EJobRole, IUserProfileResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class UserProfileResponse implements IUserProfileResponse {
  handle!: string;

  email!: string;

  nickname!: string;

  @Expose({ name: 'profile_image_url' })
  profileImageUrl!: string | null;

  @Expose({ name: 'tech_stacks' })
  techStacks!: string[] | null;

  @Expose({ name: 'job_role' })
  jobRole!: EJobRole;
}

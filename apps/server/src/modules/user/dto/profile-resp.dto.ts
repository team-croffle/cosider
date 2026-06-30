import { EJobRole, IUserProfileResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class UserProfileResponse implements IUserProfileResponse {
  @Expose()
  handle!: string;
  @Expose()
  nickname!: string | null;
  @Expose()
  techStacks!: string[] | null;
  @Expose()
  jobRole!: EJobRole;
  @Expose()
  profileImageId!: string | null;

  constructor(data?: Partial<IUserProfileResponse>) {
    Object.assign(this, data);
  }
}

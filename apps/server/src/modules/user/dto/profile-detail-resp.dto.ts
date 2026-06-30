import { EJobRole, IUserProfileDetailResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class UserProfileDetailResponse implements IUserProfileDetailResponse {
  @Expose()
  email!: string;

  @Expose()
  handle!: string;

  @Expose()
  nickname!: string;

  @Expose()
  profileImageId!: string | null;

  @Expose()
  techStacks!: string[] | null;

  @Expose()
  jobRole!: EJobRole;

  @Expose()
  updatedAt!: string | null;

  @Expose()
  handleUpdatedAt!: string | null;

  constructor(data?: Partial<IUserProfileDetailResponse>) {
    Object.assign(this, data);
  }
}

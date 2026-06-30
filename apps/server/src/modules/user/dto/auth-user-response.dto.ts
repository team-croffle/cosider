import { EJobRole, IAuthUserResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class AuthUserResponse implements IAuthUserResponse {
  @Expose()
  handle!: string;

  @Expose()
  nickname!: string | null;

  @Expose()
  profileImageId!: string | null;

  @Expose()
  jobRole!: EJobRole;

  constructor(partial: Partial<AuthUserResponse>) {
    Object.assign(this, partial);
  }
}

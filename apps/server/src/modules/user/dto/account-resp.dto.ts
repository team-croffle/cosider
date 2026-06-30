import { IUserAccountResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class UserAccountResponse implements IUserAccountResponse {
  @Expose()
  email!: string;

  @Expose()
  handle!: string;

  @Expose()
  profileImageId!: string | null;

  @Expose()
  updatedAt!: string | null;

  @Expose()
  handleUpdatedAt!: string | null;

  constructor(data?: Partial<IUserAccountResponse>) {
    Object.assign(this, data);
  }
}

import { IAccountDeleteAcceptedResponse } from '@cosider/shared';
import { EUserStatus } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class AccountDeleteAcceptedResponse implements IAccountDeleteAcceptedResponse {
  @Expose()
  userId!: string;

  @Expose()
  recoveryDeadline!: string;

  @Expose()
  permanentDeletionAt!: string;

  @Expose()
  status!: EUserStatus;

  @Expose()
  deletedAt!: string | null;

  constructor(data?: Partial<IAccountDeleteAcceptedResponse>) {
    Object.assign(this, data);
  }
}

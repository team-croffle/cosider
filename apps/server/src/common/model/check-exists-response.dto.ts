import { ICheckExistsResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class CheckExistsResponse implements ICheckExistsResponse {
  @Expose()
  isAvailable!: boolean;

  constructor(data?: Partial<ICheckExistsResponse>) {
    Object.assign(this, data);
  }
}

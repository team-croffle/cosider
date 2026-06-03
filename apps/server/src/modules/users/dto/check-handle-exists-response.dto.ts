import { ICheckHandleExistsResponse } from '@cosider/shared';

export class CheckHandleExistsResponse implements ICheckHandleExistsResponse {
  isAvailable!: boolean;
}

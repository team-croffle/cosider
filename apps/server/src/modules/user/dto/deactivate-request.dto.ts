import { IDeactivateRequest } from '@cosider/shared';

export class DeactivateReqeust implements IDeactivateRequest {
  password!: string;
}

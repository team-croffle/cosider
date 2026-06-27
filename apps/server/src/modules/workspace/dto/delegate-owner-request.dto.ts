import { IDelegateOwnerRequest } from '@cosider/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class DelegateOwnerRequest implements IDelegateOwnerRequest {
  @IsString()
  @IsNotEmpty()
  newOwnerHandle!: string;
}

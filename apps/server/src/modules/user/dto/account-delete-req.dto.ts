import { IAccountDeleteRequest } from '@cosider/shared';
import { IsString, IsNotEmpty } from 'class-validator';

export class AccountDeleteRequest implements IAccountDeleteRequest {
  @IsString()
  @IsNotEmpty()
  password!: string;
}

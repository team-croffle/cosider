import { IRestoreRequest } from '@cosider/shared';
import { IsEmail, IsString } from 'class-validator';

export class RestoreRequest implements IRestoreRequest {
  @IsEmail()
  email!: string;

  @IsString()
  code!: string;
}

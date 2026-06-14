import { IAuthorize } from '@cosider/shared';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class Signin implements IAuthorize {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

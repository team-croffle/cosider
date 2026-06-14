import { IUserAuthResponse } from '@cosider/shared';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserAuthDto implements IUserAuthResponse {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

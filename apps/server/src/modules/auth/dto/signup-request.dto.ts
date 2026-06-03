import { ISignupRequest } from '@cosider/shared';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupRequest implements ISignupRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  passwordConfirm!: string;
}

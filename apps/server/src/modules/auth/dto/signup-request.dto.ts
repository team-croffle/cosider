import { EJobRole, ISignupRequest } from '@cosider/shared';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

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

  @IsString()
  @Length(3, 30)
  handle!: string;

  @IsEnum(EJobRole)
  jobRole!: EJobRole;
}

import { IsEmail, MinLength } from 'class-validator';

export class SignupRequestDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @MinLength(8)
  passwordConfirm: string;
}

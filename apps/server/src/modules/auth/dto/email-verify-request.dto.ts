import { IEmailVerifyRequest } from '@cosider/shared';
import { IsEmail, IsString } from 'class-validator';

export class EmailVerifyRequest implements IEmailVerifyRequest {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  code!: string;
}

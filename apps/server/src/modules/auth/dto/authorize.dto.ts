import { IAuthorizeDto } from '@cosider/shared';
import { IsEmail, IsString } from 'class-validator';

export class AuthorizeDto implements IAuthorizeDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

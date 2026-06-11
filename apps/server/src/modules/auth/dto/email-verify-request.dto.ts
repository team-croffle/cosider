import { IEmailVerifyRequest } from '@cosider/shared';
import { IsString } from 'class-validator';

export class EmailVerifyRequest implements IEmailVerifyRequest {
  @IsString()
  token!: string;
}

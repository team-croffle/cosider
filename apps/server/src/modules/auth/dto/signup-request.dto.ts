import { ISignupRequest } from '@cosider/shared';
import { IsNotEmpty, IsString } from 'class-validator';

import { AuthorizeDto } from './authorize.dto';

export class SignupRequest extends AuthorizeDto implements ISignupRequest {
  @IsString()
  @IsNotEmpty()
  passwordConfirm!: string;
}

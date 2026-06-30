import { IUserHandleUpdateRequest } from '@cosider/shared';
import { IsOptional, IsString } from 'class-validator';

export class UserHandleUpdateRequest implements IUserHandleUpdateRequest {
  @IsString()
  @IsOptional()
  handle?: string;
}

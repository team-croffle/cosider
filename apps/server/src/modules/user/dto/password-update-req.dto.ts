import { IPasswordUpdateRequest } from '@cosider/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordUpdateRequest implements IPasswordUpdateRequest {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @IsString()
  @IsNotEmpty()
  newPassword!: string;

  @IsString()
  @IsNotEmpty()
  newPasswordConfirm!: string;
}

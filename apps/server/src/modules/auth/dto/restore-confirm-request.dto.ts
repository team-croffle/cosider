import { IRestoreCofirmRequest } from '@cosider/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class RestoreConfirmRequest implements IRestoreCofirmRequest {
  @IsString()
  @IsNotEmpty({ message: '인증 토큰이 필요합니다.' })
  token!: string;
}

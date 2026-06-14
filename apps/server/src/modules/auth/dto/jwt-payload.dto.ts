import { IsNotEmpty } from 'class-validator';

import { IJwtPayload } from '../interface/jwt-payload.interface';

export class JwtPayloadDto implements IJwtPayload {
  @IsNotEmpty()
  userId!: string;
}

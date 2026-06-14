import { IJwtPayload } from '../interface/jwt-payload.interface';

export class JwtPayloadDto implements IJwtPayload {
  userId!: string;
  email!: string;
}

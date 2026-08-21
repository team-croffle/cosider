import { EWorkspaceUserRole, IMemberInviteRequest } from '@cosider/shared';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class MemberInviteRequest implements IMemberInviteRequest {
  @IsString()
  @IsNotEmpty()
  target!: string;

  @IsEnum(EWorkspaceUserRole)
  role!: EWorkspaceUserRole;
}

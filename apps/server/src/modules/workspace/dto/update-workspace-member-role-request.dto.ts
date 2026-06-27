import { EWorkspaceUserRole, IUpdateMemberRoleRequest } from '@cosider/shared';
import { IsEnum } from 'class-validator';

export class UpdateMemberRoleRequest implements IUpdateMemberRoleRequest {
  @IsEnum(EWorkspaceUserRole)
  role!: EWorkspaceUserRole;
}

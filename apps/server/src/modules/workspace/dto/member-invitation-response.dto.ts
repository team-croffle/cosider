import { EWorkspaceUserRole, IMemberInvitationResponse } from '@cosider/shared';
import { Expose } from 'class-transformer';

export class MemberInvitationResponse implements IMemberInvitationResponse {
  @Expose()
  id!: string;

  @Expose()
  inviter!: IMemberInvitationResponse['inviter'];

  @Expose()
  target!: string;

  @Expose()
  role!: EWorkspaceUserRole;

  @Expose()
  createdAt!: string;

  @Expose()
  expiresAt!: string;

  @Expose()
  acceptedAt!: string | null;

  constructor(partial: Partial<MemberInvitationResponse>) {
    Object.assign(this, partial);
  }
}

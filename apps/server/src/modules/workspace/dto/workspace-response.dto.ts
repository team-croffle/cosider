import {
  EWorkspaceStatus,
  EWorkspaceUserRole,
  IUserProfileResponse,
  IWorkspaceDetailResponse,
  IWorkspaceResponse,
} from '@cosider/shared';
import { Expose } from 'class-transformer';

export class WorkspaceResponse implements IWorkspaceResponse {
  @Expose()
  slug!: string;

  @Expose()
  name!: string;

  @Expose()
  status!: EWorkspaceStatus;

  @Expose()
  description!: string;

  @Expose()
  logoImageId!: string | null;

  @Expose()
  createdAt!: string;

  @Expose()
  role!: EWorkspaceUserRole;

  constructor(data?: Partial<IWorkspaceResponse>) {
    Object.assign(this, data);
  }
}

export class WorkspaceDetailResponse implements IWorkspaceDetailResponse {
  @Expose()
  slug!: string;

  @Expose()
  name!: string;

  @Expose()
  status!: EWorkspaceStatus;

  @Expose()
  description!: string;

  @Expose()
  logoImageId!: string | null;

  @Expose()
  createdAt!: string;

  @Expose()
  role!: EWorkspaceUserRole;

  @Expose()
  owner!: Pick<IUserProfileResponse, 'handle' | 'nickname' | 'profileImageId'>;

  // TODO: 프로젝트 담당자가 ProjectItemDto 정의 후 교체
  @Expose()
  projects!: Record<string, unknown>[];

  constructor(data?: Partial<IWorkspaceDetailResponse>) {
    Object.assign(this, data);
  }
}

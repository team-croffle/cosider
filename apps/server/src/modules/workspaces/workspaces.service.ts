import {
  CreateWorkspaceRequestDto,
  DeleteWorkspaceResponseDto,
  EWorkspaceStatus,
  EWorkspaceUserRole,
  GetWorkspaceListResponseDto,
  UpdateWorkspaceRequestDto,
  WorkspaceDetailResponseDto,
  WorkspaceResponseDto,
} from '@cosider/shared';
import { Injectable } from '@nestjs/common';

// TODO: Drizzle 세팅 완료 후 실제 DB 쿼리로 교체
const DUMMY_WORKSPACE = {
  id: '497f6eca-6276-4993-bfeb-53cbbbba6f08',
  slug: 'my-workspace',
  name: 'My Workspace',
  status: EWorkspaceStatus.ACTIVE,
  description: '테스트 워크스페이스입니다.',
  logo_url: 'https://example.com/logo.png',
  role: EWorkspaceUserRole.OWNER,
  created_at: new Date().toISOString(),
};

@Injectable()
export class WorkspacesService {
  async createWorkspace(dto: CreateWorkspaceRequestDto): Promise<WorkspaceResponseDto> {
    // TODO: DB insert 로직으로 교체
    // TODO: workspaces 테이블 insert 후 workspace_members에 생성자 OWNER로 자동 등록
    return {
      ...DUMMY_WORKSPACE,
      slug: dto.slug,
      name: dto.name,
      description: dto.description,
      logo_url: dto.logo_url,
    };
  }

  async getWorkspaceList(): Promise<GetWorkspaceListResponseDto> {
    // TODO: 로그인 유저 기준 workspace_members 조회로 교체
    return {
      list: [DUMMY_WORKSPACE],
    };
  }

  async getWorkspaceDetail(workspaceSlug: string): Promise<WorkspaceDetailResponseDto> {
    // TODO: slug 기준 workspace 조회 후 projects 조회로 교체
    return {
      ...DUMMY_WORKSPACE,
      slug: workspaceSlug,
      projects: [],
    };
  }

  async updateWorkspace(
    workspaceSlug: string,
    dto: UpdateWorkspaceRequestDto,
  ): Promise<WorkspaceResponseDto> {
    // TODO: slug 기준 workspace 업데이트 교체
    return {
      ...DUMMY_WORKSPACE,
      slug: dto.slug,
      name: dto.name,
      description: dto.description,
    };
  }

  async deleteWorkspace(workspaceSlug: string): Promise<DeleteWorkspaceResponseDto> {
    // TODO: status를 DELETE_PENDING으로 변경 후 scheduled_delete_at 설정으로 교체
    // TODO: FRID-32(1개월) vs ERD(24시간) 정책 불일치, 확인 후 수정 필요
    const now = new Date();
    const scheduledDeleteAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24시간 후

    return {
      workspace_slug: workspaceSlug,
      status: EWorkspaceStatus.DELETE_PENDING,
      deleted_at: now.toISOString(),
      scheduled_delete_at: scheduledDeleteAt.toISOString(),
    };
  }

  async restoreWorkspace(_workspaceSlug: string): Promise<void> {
    // TODO: status를 ACTIVE로 변경 후 scheduled_delete_at, deleted_at NULL로 교체
  }
}

import type { IWorkspaceResponse } from '@cosider/shared';

export function useWorkspace() {
  // slug 실시간 중복 확인
  // TODO: debounce 처리 필요 - 컴포넌트에서 호출 시 적용
  async function checkSlugAvailability(slug: string): Promise<boolean> {
    const data = await $fetch<{ is_available: boolean }>('/api/v1/workspaces/exists/slug', {
      query: { slug },
    });
    return data.is_available;
  }

  // presigned URL 발급
  // TODO: 백엔드 완성 후 연결 - 응답 upload_token 저장 후 createWorkspace에 전달
  async function requestLogoPresignedUrl(fileName: string, contentType: string) {
    return $fetch<{ upload_url: string; upload_token: string; expires_at: string }>(
      '/api/v1/workspaces/logo/presigned-url',
      {
        method: 'POST',
        body: { file_name: fileName, content_type: contentType },
      },
    );
  }

  // S3 직접 업로드
  // TODO: 백엔드 완성 후 연결
  async function uploadLogoToS3(uploadUrl: string, file: File): Promise<void> {
    await $fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });
  }

  // 워크스페이스 생성
  // TODO: @cosider/shared ICreateWorkspaceRequest 타입 logoUrl → logoUploadToken 변경 필요 (백엔드 담당자 확인)
  async function createWorkspace(payload: {
    name: string;
    slug: string;
    description: string | null;
    logo_upload_token?: string;
  }): Promise<IWorkspaceResponse> {
    return $fetch<IWorkspaceResponse>('/api/v1/workspaces', {
      method: 'POST',
      body: payload,
    });
  }

  // 워크스페이스 목록 조회
  async function fetchWorkspaces(): Promise<IWorkspaceResponse[]> {
    return $fetch<IWorkspaceResponse[]>('/api/v1/workspaces');
  }

  return {
    checkSlugAvailability,
    requestLogoPresignedUrl,
    uploadLogoToS3,
    createWorkspace,
    fetchWorkspaces,
  };
}

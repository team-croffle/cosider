import { EWorkspaceStatus, EWorkspaceUserRole } from '@cosider/shared';
import { z } from 'zod';

// zod로 API 응답 런타임 검증 스키마
export const WorkspaceResponseSchema = z.object({
  slug: z.string(),
  name: z.string(),
  status: z.enum(Object.values(EWorkspaceStatus) as [string, ...string[]]),
  description: z.string().nullable(),
  logoImageId: z.uuidv7().nullable(),
  createdAt: z.string(),
  role: z.enum(Object.values(EWorkspaceUserRole) as [string, ...string[]]),
});

export const WorkspaceListSchema = z.array(WorkspaceResponseSchema);

export function useWorkspace() {
  // slug 실시간 중복 확인
  // TODO: debounce 처리 필요 - 컴포넌트에서 호출 시 적용
  async function checkSlugAvailability(slug: string): Promise<boolean> {
    try {
      const data = await $fetch<{ isAvailable: boolean }>('/api/v1/workspaces/exists/slug', {
        query: { slug },
      });
      return data.isAvailable;
    } catch (error: unknown) {
      const status = (error as { statusCode?: number })?.statusCode;
      if (status === undefined) {
        throw new Error('네트워크 오류가 발생했습니다.', { cause: error });
      }
      return false;
    }
  }

  return {
    checkSlugAvailability,
  };
}

import { z } from 'zod';

// zod로 API 응답 런타임 검증 스키마
export const WorkspaceResponseSchema = z.object({
  slug: z.string(),
  name: z.string(),
  status: z.string(),
  description: z.string().nullable(),
  logoUrl: z.string(),
  createdAt: z.string(),
  role: z.string(),
});

export const WorkspaceListSchema = z.array(WorkspaceResponseSchema);

export function useWorkspace() {
  // slug 실시간 중복 확인
  // TODO: debounce 처리 필요 - 컴포넌트에서 호출 시 적용
  async function checkSlugAvailability(slug: string): Promise<boolean> {
    try {
      const data = await $fetch<{ is_available: boolean }>('/api/v1/workspaces/exists/slug', {
        query: { slug },
      });
      return data.is_available;
    } catch {
      return false;
    }
  }

  return {
    checkSlugAvailability,
  };
}

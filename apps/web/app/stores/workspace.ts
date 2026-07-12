import type { ICreateWorkspaceRequest, IWorkspaceResponse } from '@cosider/shared';
import { defineStore } from 'pinia';

import { WorkspaceListSchema, WorkspaceResponseSchema } from '~/composables/use-workspace';

export const useWorkspaceStore = defineStore('workspace', () => {
  const { $api } = useNuxtApp();
  const toast = useToast();

  const workspaces = ref<IWorkspaceResponse[]>([]);
  const isLoading = ref(false);

  // 워크스페이스 목록 조회
  async function fetchWorkspaces() {
    isLoading.value = true;
    try {
      const data = await $api<IWorkspaceResponse[]>('/api/v1/workspaces');
      workspaces.value = WorkspaceListSchema.parse(data) as IWorkspaceResponse[];
    } catch {
      toast.add({
        title: '오류',
        description: '워크스페이스 목록을 불러오지 못했습니다.',
        color: 'error',
      });
    } finally {
      isLoading.value = false;
    }
  }

  // 워크스페이스 생성
  async function createWorkspace(payload: ICreateWorkspaceRequest): Promise<boolean> {
    try {
      const data = await $api<IWorkspaceResponse>('/api/v1/workspaces', {
        method: 'POST',
        body: payload,
      });
      WorkspaceResponseSchema.parse(data);
      workspaces.value = [...workspaces.value, data as IWorkspaceResponse];
      toast.add({
        title: '성공',
        description: '워크스페이스가 생성되었습니다.',
        color: 'success',
      });
      return true;
    } catch (error: unknown) {
      const status = (error as { statusCode?: number })?.statusCode;
      const description =
        status === 409 ? 'slug가 이미 사용 중입니다.' : '워크스페이스 생성에 실패했습니다.';
      toast.add({ title: '오류', description, color: 'error' });
      return false;
    }
  }

  return {
    workspaces,
    isLoading,
    fetchWorkspaces,
    createWorkspace,
  };
});

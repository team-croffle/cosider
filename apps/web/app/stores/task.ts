import type { ICreateNewTaskRequest, ITaskResponse } from '@cosider/shared';
import { defineStore } from 'pinia';

import { TaskListSchema, TaskResponseSchema } from '~/composables/use-task';

export const useTaskStore = defineStore('task', () => {
  const { $api } = useNuxtApp();
  const toast = useToast();

  const tasks = ref<ITaskResponse[]>([]);
  const isLoading = ref(false);

  async function fetchTasks(workspaceSlug: string, projectKey: string) {
    isLoading.value = true;
    try {
      const data = await $api<ITaskResponse[]>(
        `/api/v1/workspaces/${workspaceSlug}/projects/${projectKey}/tasks`,
      );
      tasks.value = TaskListSchema.parse(data) as ITaskResponse[];
    } catch {
      toast.add({
        title: '오류',
        description: '태스크 목록을 불러오지 못했습니다.',
        color: 'error',
      });
    } finally {
      isLoading.value = false;
    }
  }

  async function createTask(
    workspaceSlug: string,
    projectKey: string,
    payload: ICreateNewTaskRequest,
  ): Promise<boolean> {
    try {
      const data = await $api<ITaskResponse>(
        `/api/v1/workspaces/${workspaceSlug}/projects/${projectKey}/tasks`,
        { method: 'POST', body: payload },
      );
      TaskResponseSchema.parse(data);
      tasks.value = [...tasks.value, data as ITaskResponse];
      toast.add({ title: '성공', description: '태스크가 생성되었습니다.', color: 'success' });
      return true;
    } catch (error: unknown) {
      const status = (error as { statusCode?: number })?.statusCode;
      const description =
        status === 404 ? '담당자를 찾을 수 없습니다.' : '태스크 생성에 실패했습니다.';
      toast.add({ title: '오류', description, color: 'error' });
      return false;
    }
  }

  return { tasks, isLoading, fetchTasks, createTask };
});

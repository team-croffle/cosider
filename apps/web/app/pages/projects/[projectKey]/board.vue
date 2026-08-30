<script setup lang="ts">
  import { ETaskStatus } from '@cosider/shared';

  import { MODAL_IDS } from '~/constants/modal.const';

  const route = useRoute();
  const projectKey = route.params.projectKey as string;

  const { open: openTaskCreate } = useModal(MODAL_IDS.TASK_CREATE);

  const workspaceStore = useWorkspaceStore();
  const taskStore = useTaskStore();

  if (workspaceStore.workspaces.length === 0) {
    await workspaceStore.fetchWorkspaces();
  }
  const workspaceSlug = workspaceStore.currentWorkspace?.slug;
  if (workspaceSlug) {
    await taskStore.fetchTasks(workspaceSlug, projectKey);
  }

  const search = ref('');
  const filteredTasks = computed(() =>
    taskStore.tasks.filter((t) => t.title.toLowerCase().includes(search.value.toLowerCase())),
  );

  const doneCount = computed(
    () => taskStore.tasks.filter((t) => t.status === ETaskStatus.DONE).length,
  );
  const openCount = computed(
    () => taskStore.tasks.filter((t) => t.status !== ETaskStatus.DONE).length,
  );
</script>

<template>
  <div class="flex flex-1 overflow-hidden">
    <ProjectSidebar :project-id="projectKey" active-page="board" />

    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <LayoutPageHeader title="Board" description="Manage tasks and track progress">
        <template #actions>
          <UButton variant="outline" icon="i-lucide-filter">Filter</UButton>
          <UButton icon="i-lucide-plus" @click="openTaskCreate({ projectKey })">Add Task</UButton>
        </template>
      </LayoutPageHeader>

      <LayoutPageToolbar>
        <template #search>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Search tasks..."
            class="w-full"
          />
        </template>
        <template #stats>
          <span class="text-success flex items-center gap-1">
            <UIcon name="i-lucide-check-circle" /> {{ doneCount }} Done
          </span>
          <span class="text-warning flex items-center gap-1">
            <UIcon name="i-lucide-clock" /> {{ openCount }} Open
          </span>
        </template>
      </LayoutPageToolbar>

      <div class="flex flex-col gap-3 p-6">
        <TaskBoard
          :tasks="filteredTasks"
          :project-key="projectKey"
          @add-task="(status: ETaskStatus) => openTaskCreate({ projectKey, status })"
        />
      </div>
    </div>
  </div>
</template>

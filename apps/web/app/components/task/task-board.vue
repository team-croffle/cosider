<script setup lang="ts">
  import type { ITaskResponse } from '@cosider/shared';
  import { ETaskStatus } from '@cosider/shared';

  const props = defineProps<{
    tasks: ITaskResponse[];
    projectKey: string;
  }>();

  const emit = defineEmits<{ addTask: [status: ETaskStatus] }>();

  const COLUMNS: { status: ETaskStatus; label: string }[] = [
    { status: ETaskStatus.TODO, label: 'To Do' },
    { status: ETaskStatus.IN_PROGRESS, label: 'In Progress' },
    { status: ETaskStatus.DONE, label: 'Done' },
  ];

  const columns = computed(() =>
    COLUMNS.map((col) => ({
      ...col,
      tasks: props.tasks.filter((t) => t.status === col.status),
    })),
  );
</script>

<template>
  <div class="flex gap-4 overflow-x-auto p-6">
    <TaskBoardColumn
      v-for="col in columns"
      :key="col.status"
      :label="col.label"
      :tasks="col.tasks"
      :project-key="projectKey"
      @add="emit('addTask', col.status)"
    />
  </div>
</template>

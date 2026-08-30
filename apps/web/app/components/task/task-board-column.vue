<script setup lang="ts">
  import type { ITaskResponse } from '@cosider/shared';

  defineProps<{
    label: string;
    tasks: ITaskResponse[];
    projectKey: string;
  }>();

  const emit = defineEmits<{ add: [] }>();
</script>

<template>
  <div class="flex w-72 shrink-0 flex-col gap-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold">{{ label }}</span>
        <UBadge :label="String(tasks.length)" size="sm" color="neutral" variant="subtle" />
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-plus"
        size="xs"
        square
        @click="emit('add')"
      />
    </div>

    <div class="flex flex-col gap-2">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" :project-key="projectKey" />
    </div>
  </div>
</template>

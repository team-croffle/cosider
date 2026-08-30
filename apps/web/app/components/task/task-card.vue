<script setup lang="ts">
  import type { ITaskResponse } from '@cosider/shared';

  const props = defineProps<{
    task: ITaskResponse;
    projectKey: string;
  }>();

  const taskCode = computed(() => `${props.projectKey.toUpperCase()}-${props.task.taskNumber}`);

  const PRIORITY_META: Record<
    NonNullable<ITaskResponse['priority']>,
    { label: string; color: 'error' | 'warning' | 'info' }
  > = {
    HIGH: { label: 'High', color: 'error' },
    MID: { label: 'Medium', color: 'warning' },
    LOW: { label: 'Low', color: 'info' },
  };

  const priorityMeta = computed(() =>
    props.task.priority ? PRIORITY_META[props.task.priority] : null,
  );
</script>

<template>
  <UCard class="hover:bg-elevated cursor-pointer transition" :ui="{ body: 'p-3 sm:p-3' }">
    <div class="mb-2 flex items-center justify-between gap-2">
      <span class="text-muted text-xs font-medium">{{ taskCode }}</span>
      <UBadge
        v-if="priorityMeta"
        :label="priorityMeta.label"
        :color="priorityMeta.color"
        variant="subtle"
        size="sm"
      />
    </div>

    <p class="mb-3 text-sm font-medium">{{ task.title }}</p>

    <div class="flex items-center justify-end">
      <div
        v-if="task.assignee"
        class="bg-primary flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        :title="task.assignee.nickname ?? undefined"
      >
        {{ (task.assignee.nickname ?? '?')[0] }}
      </div>
    </div>
  </UCard>
</template>

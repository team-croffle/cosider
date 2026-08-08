<script setup lang="ts">
  import { MODAL_IDS } from '~/constants/modal.const';

  const { isOpen, close } = useModal(MODAL_IDS.TASK_CREATE);

  const title = ref('');
  const description = ref('');
</script>

<template>
  <USlideover
    :open="isOpen"
    title="New Task"
    description="Create a task in the current workspace"
    @update:open="(v: boolean) => !v && close()"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Title">
          <UInput v-model="title" placeholder="Task title" class="w-full" />
        </UFormField>
        <UFormField label="Description" hint="optional">
          <UTextarea
            v-model="description"
            placeholder="Describe the task…"
            class="w-full"
            :rows="4"
          />
        </UFormField>
        <p class="text-muted text-xs">
          <!-- TODO: wire create task API -->
          Form is a placeholder shell. Saving is not connected yet.
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="close()"> Cancel </UButton>
        <UButton color="primary" disabled> Create </UButton>
      </div>
    </template>
  </USlideover>
</template>

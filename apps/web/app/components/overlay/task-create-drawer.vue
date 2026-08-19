<script setup lang="ts">
  import type { ICreateNewTaskRequest } from '@cosider/shared';
  import { EPriority, ETaskStatus } from '@cosider/shared';
  import type { FormError, FormSubmitEvent } from '@nuxt/ui';

  import { MODAL_IDS } from '~/constants/modal.const';
  import { useTaskStore } from '~/stores/task';

  interface TaskCreatePayload {
    projectKey: string;
    status?: ETaskStatus;
  }

  const { isOpen, close, payload } = useModal(MODAL_IDS.TASK_CREATE);
  const workspaceStore = useWorkspaceStore();
  const taskStore = useTaskStore();

  const modalPayload = computed(() => payload.value as TaskCreatePayload | undefined);
  const projectKey = computed(() => modalPayload.value?.projectKey);

  const form = reactive<ICreateNewTaskRequest>({
    title: '',
    description: null,
    assigneeHandle: null,
    status: ETaskStatus.TODO,
    priority: EPriority.MID,
    startDate: null,
    dueDate: null,
  });

  const STATUS_OPTIONS = [
    { label: 'To Do', value: ETaskStatus.TODO },
    { label: 'In Progress', value: ETaskStatus.IN_PROGRESS },
    { label: 'Done', value: ETaskStatus.DONE },
    { label: 'Cancelled', value: ETaskStatus.CANCEL },
    { label: 'On Hold', value: ETaskStatus.WITHHOLD },
  ];

  const PRIORITY_OPTIONS = [
    { label: 'Low', value: EPriority.LOW },
    { label: 'Medium', value: EPriority.MID },
    { label: 'High', value: EPriority.HIGH },
  ];

  watch(isOpen, (open) => {
    if (open) {
      form.status = modalPayload.value?.status ?? ETaskStatus.TODO;
    } else {
      resetForm();
    }
  });

  function resetForm() {
    form.title = '';
    form.description = null;
    form.assigneeHandle = null;
    form.status = ETaskStatus.TODO;
    form.priority = EPriority.MID;
    form.startDate = null;
    form.dueDate = null;
  }

  function validate(state: typeof form): FormError[] {
    const errors: FormError[] = [];
    if (!state.title.trim()) {
      errors.push({ name: 'title', message: '제목을 입력해주세요.' });
    }
    return errors;
  }

  async function onSubmit(event: FormSubmitEvent<typeof form>) {
    const workspaceSlug = workspaceStore.currentWorkspace?.slug;
    if (!workspaceSlug || !projectKey.value) return;

    const success = await taskStore.createTask(workspaceSlug, projectKey.value, event.data);
    if (success) close();
  }
</script>

<template>
  <USlideover
    :open="isOpen"
    title="New Task"
    description="Create a task in the current workspace"
    @update:open="(v: boolean) => !v && close()"
  >
    <template #body>
      <UForm
        id="task-form"
        :validate="validate"
        :state="form"
        :validate-on="[]"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Title" name="title" required>
          <UInput v-model="form.title" placeholder="Task title" class="w-full" />
        </UFormField>

        <UFormField label="Description" hint="optional">
          <UTextarea
            :model-value="form.description ?? ''"
            placeholder="Describe the task…"
            class="w-full"
            :rows="4"
            @update:model-value="form.description = $event || null"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Status">
            <USelect
              :model-value="form.status ?? undefined"
              :items="STATUS_OPTIONS"
              class="w-full"
              @update:model-value="form.status = $event ?? null"
            />
          </UFormField>

          <UFormField label="Priority">
            <USelect
              :model-value="form.priority ?? undefined"
              :items="PRIORITY_OPTIONS"
              class="w-full"
              @update:model-value="form.priority = $event ?? null"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Start Date" hint="optional">
            <UInput
              type="date"
              :model-value="form.startDate ?? ''"
              class="w-full"
              @update:model-value="form.startDate = ($event as string) || null"
            />
          </UFormField>

          <UFormField label="Due Date" hint="optional">
            <UInput
              type="date"
              :model-value="form.dueDate ?? ''"
              class="w-full"
              @update:model-value="form.dueDate = ($event as string) || null"
            />
          </UFormField>
        </div>

        <UFormField label="Assignee" hint="optional">
          <UInput
            :model-value="form.assigneeHandle ?? ''"
            placeholder="Enter user handle (e.g. jane)"
            class="w-full"
            @update:model-value="form.assigneeHandle = ($event as string) || null"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="close()"> Cancel </UButton>
        <UButton color="primary" type="submit" form="task-form"> Create </UButton>
      </div>
    </template>
  </USlideover>
</template>

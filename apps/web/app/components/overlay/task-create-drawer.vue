<script setup lang="ts">
  import { MODAL_IDS } from '~/constants/modal.const';

  const { t } = useI18n();
  const { isOpen, close } = useModal(MODAL_IDS.TASK_CREATE);

  const title = ref('');
  const description = ref('');
</script>

<template>
  <USlideover
    :open="isOpen"
    :title="t('task.create.title')"
    :description="t('task.create.description')"
    @update:open="(v: boolean) => !v && close()"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField :label="t('task.create.fieldTitle')">
          <UInput v-model="title" :placeholder="t('task.create.titlePlaceholder')" class="w-full" />
        </UFormField>
        <UFormField :label="t('task.create.fieldDescription')" :hint="t('common.optional')">
          <UTextarea
            v-model="description"
            :placeholder="t('task.create.descriptionPlaceholder')"
            class="w-full"
            :rows="4"
          />
        </UFormField>
        <p class="text-muted text-xs">
          <!-- TODO: wire create task API -->
          {{ t('task.create.placeholderNote') }}
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="close()">
          {{ t('common.cancel') }}
        </UButton>
        <UButton color="primary" disabled>{{ t('task.create.submit') }}</UButton>
      </div>
    </template>
  </USlideover>
</template>

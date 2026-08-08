<script setup lang="ts">
  import { MODAL_IDS } from '~/constants/modal.const';

  export type ConfirmPayload = {
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    color?: 'error' | 'primary' | 'neutral' | 'warning';
    onConfirm?: () => void | Promise<void>;
  };

  const { isOpen, payload, close } = useModal(MODAL_IDS.CONFIRM);

  const data = computed(() => (payload.value as ConfirmPayload | undefined) ?? {});

  const loading = ref(false);

  async function onConfirm() {
    loading.value = true;
    try {
      await data.value.onConfirm?.();
      close();
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <UModal
    :open="isOpen"
    :title="data.title ?? 'Confirm'"
    :description="data.description"
    @update:open="(v: boolean) => !v && close()"
  >
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" :disabled="loading" @click="close()">
          {{ data.cancelLabel ?? 'Cancel' }}
        </UButton>
        <UButton :color="data.color ?? 'error'" :loading="loading" @click="onConfirm">
          {{ data.confirmLabel ?? 'Confirm' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

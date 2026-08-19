<script setup lang="ts">
  const { t } = useI18n();
  const { isOpen, data, accept, dismiss } = useConfirm();
</script>

<template>
  <UModal
    :open="isOpen"
    :title="data.title ?? t('common.confirm')"
    :description="data.description"
    @update:open="(v: boolean) => !v && dismiss()"
  >
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="dismiss()">
          {{ data.cancelLabel ?? t('common.cancel') }}
        </UButton>
        <UButton :color="data.color ?? 'error'" @click="accept()">
          {{ data.confirmLabel ?? t('common.confirm') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

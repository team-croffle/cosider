<script setup lang="ts">
  const { isOpen, data, accept, dismiss } = useConfirm();
</script>

<template>
  <UModal
    :open="isOpen"
    :title="data.title ?? 'Confirm'"
    :description="data.description"
    @update:open="(v: boolean) => !v && dismiss()"
  >
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="dismiss()">
          {{ data.cancelLabel ?? 'Cancel' }}
        </UButton>
        <UButton :color="data.color ?? 'error'" @click="accept()">
          {{ data.confirmLabel ?? 'Confirm' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

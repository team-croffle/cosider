<script setup lang="ts">
  import { MODAL_IDS } from '~/constants/modal.const';

  const { isOpen, close } = useModal(MODAL_IDS.WORKSPACE_CREATE);

  const open = computed({
    get: () => isOpen.value,
    set: (value: boolean) => {
      if (!value) close();
    },
  });
</script>

<template>
  <WorkspaceCreateModal v-model="open" />
</template>

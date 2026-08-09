<script setup lang="ts">
  withDefaults(
    defineProps<{
      /** Show wordmark text next to mark */
      showText?: boolean;
    }>(),
    { showText: true },
  );
</script>

<template>
  <span class="text-primary inline-flex items-center gap-2">
    <span
      class="bg-primary flex size-7 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white"
      aria-hidden="true"
    >
      C
    </span>
    <span v-if="showText" class="text-xl font-bold tracking-tight"> CoSider </span>
  </span>
</template>

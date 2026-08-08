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
  <span class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-500">
    <span
      class="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white dark:bg-blue-500"
      aria-hidden="true"
    >
      C
    </span>
    <span v-if="showText" class="text-xl font-bold tracking-tight"> CoSider </span>
  </span>
</template>

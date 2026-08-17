<script setup lang="ts">
  import logoMark from '~/assets/logo/mark.svg?raw';

  withDefaults(
    defineProps<{
      /** Show wordmark text next to mark */
      showText?: boolean;
    }>(),
    { showText: true },
  );
</script>

<template>
  <span
    class="text-primary inline-flex items-center gap-2"
    :aria-label="showText ? undefined : 'Cosider'"
    :role="showText ? undefined : 'img'"
  >
    <span
      class="inline-flex size-7 shrink-0 [&>svg]:size-full"
      aria-hidden="true"
      v-html="logoMark"
    />
    <span v-if="showText" class="text-xl font-bold tracking-tight">Cosider</span>
  </span>
</template>

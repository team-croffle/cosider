<script setup lang="ts">
  defineProps<{
    title: string;
    description?: string;
  }>();
</script>

<template>
  <div class="border-default flex items-start justify-between gap-4 border-b px-6 py-4">
    <div class="min-w-0">
      <h1 class="truncate text-xl font-bold">{{ title }}</h1>
      <p v-if="description" class="text-muted mt-1 text-sm">{{ description }}</p>
      <slot name="subtitle" />
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

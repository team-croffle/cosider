<script setup lang="ts">
  // Shared toolbar strip under PageHeader (search / filters / stats slots)
</script>

<template>
  <div class="bg-elevated/50 border-default flex flex-wrap items-center gap-3 border-b px-6 py-3">
    <div class="min-w-0 flex-1">
      <slot name="search" />
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <slot name="filters" />
    </div>
    <div class="text-muted ml-auto flex items-center gap-3 text-sm">
      <slot name="stats" />
    </div>
    <slot />
  </div>
</template>

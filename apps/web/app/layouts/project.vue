<script setup lang="ts">
  // Nested under default layout: GNB + LNB remain; this adds a content row for ProjectSidebar.
</script>

<template>
  <NuxtLayout name="default">
    <div class="flex h-full min-h-0">
      <slot />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
  // TODO: wire to search API when /search endpoint exists
  const open = ref(false);
</script>

<template>
  <div class="mx-4 w-full max-w-md flex-1">
    <UButton
      color="neutral"
      variant="soft"
      icon="i-lucide-search"
      class="w-full justify-start font-normal"
      @click="open = true"
    >
      <span class="text-muted truncate">Search projects, issues, docs…</span>
      <span class="text-muted ml-auto hidden text-xs sm:inline">⌘K</span>
    </UButton>

    <UModal v-model:open="open" title="Search">
      <template #body>
        <UInput icon="i-lucide-search" placeholder="Search…" autofocus class="w-full" disabled />
        <div class="text-muted mt-6 py-8 text-center text-sm">검색 준비 중</div>
      </template>
    </UModal>
  </div>
</template>

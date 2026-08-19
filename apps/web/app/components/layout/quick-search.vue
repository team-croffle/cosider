<script setup lang="ts">
  // TODO: wire to search API when /search endpoint exists
  const open = ref(false);
  const { t } = useI18n();
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
      <span class="text-muted truncate">{{ t('shell.search.placeholder') }}</span>
      <span class="text-muted ml-auto hidden text-xs sm:inline">⌘K</span>
    </UButton>

    <UModal v-model:open="open" :title="t('shell.search.title')">
      <template #body>
        <UInput
          icon="i-lucide-search"
          :placeholder="t('shell.search.placeholder')"
          autofocus
          class="w-full"
          disabled
        />
        <div class="text-muted mt-6 py-8 text-center text-sm">
          {{ t('shell.search.comingSoon') }}
        </div>
      </template>
    </UModal>
  </div>
</template>

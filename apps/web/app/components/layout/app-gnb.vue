<script setup lang="ts">
  const langOpen = ref(false);
  const lang = ref<'en' | 'ko'>('ko');
</script>

<template>
  <header
    class="sticky top-0 z-50 flex h-(--cosider-gnb-height) items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-950"
  >
    <div class="flex items-center gap-4">
      <NuxtLink to="/" class="shrink-0">
        <AppLogo :show-text="true" />
      </NuxtLink>
      <LayoutWorkspaceSwitcher />
    </div>

    <LayoutQuickSearch />

    <div class="flex shrink-0 items-center gap-0.5">
      <UPopover v-model:open="langOpen" :content="{ align: 'end' }">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-languages"
          square
          aria-label="Language"
        />
        <template #content>
          <div class="w-40 p-2">
            <p class="text-muted px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
              Language
            </p>
            <UButton
              block
              color="neutral"
              :variant="lang === 'en' ? 'soft' : 'ghost'"
              size="sm"
              class="justify-between"
              @click="
                lang = 'en';
                langOpen = false;
              "
            >
              English
              <UIcon v-if="lang === 'en'" name="i-lucide-check" class="text-primary size-3" />
            </UButton>
            <UButton
              block
              color="neutral"
              :variant="lang === 'ko' ? 'soft' : 'ghost'"
              size="sm"
              class="justify-between"
              @click="
                lang = 'ko';
                langOpen = false;
              "
            >
              한국어
              <UIcon v-if="lang === 'ko'" name="i-lucide-check" class="text-primary size-3" />
            </UButton>
          </div>
        </template>
      </UPopover>

      <UColorModeButton />
      <LayoutNotificationPopover />
      <LayoutUserMenu />
    </div>
  </header>
</template>

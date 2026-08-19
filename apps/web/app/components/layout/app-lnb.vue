<script setup lang="ts">
  import { MODAL_IDS } from '~/constants/modal.const';

  const route = useRoute();
  const { t } = useI18n();
  const { open: openTaskCreate } = useModal(MODAL_IDS.TASK_CREATE);

  const workspaceLinks = computed(() => [
    {
      to: '/dashboard',
      icon: 'i-lucide-layout-dashboard',
      label: t('shell.nav.dashboard'),
      match: '/dashboard',
    },
    {
      to: '/projects',
      icon: 'i-lucide-folder-git-2',
      label: t('shell.nav.projects'),
      match: '/projects',
    },
    {
      to: '/documents',
      icon: 'i-lucide-archive',
      label: t('shell.nav.documents'),
      match: '/documents',
    },
    {
      to: '/settings',
      icon: 'i-lucide-settings',
      label: t('shell.nav.settings'),
      match: '/settings',
    },
  ]);

  // Stub favorites — no favorites API yet
  const favorites = [
    { to: '/projects/1/board', label: 'Frontend Rewrite', color: 'bg-green-500' },
    { to: '/projects/2/board', label: '코사이더 개발 가이드', color: 'bg-blue-500' },
  ];

  function isActive(match: string) {
    if (match === '/dashboard') {
      return route.path === '/dashboard';
    }
    return route.path.startsWith(match);
  }
</script>

<template>
  <aside
    class="hidden w-(--cosider-lnb-width) shrink-0 flex-col border-r border-neutral-200 bg-white md:flex dark:border-neutral-800 dark:bg-neutral-950"
  >
    <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      <div class="mb-6">
        <div class="text-muted mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
          {{ t('shell.nav.workspace') }}
        </div>
        <LayoutSidebarNavItem
          v-for="link in workspaceLinks"
          :key="link.to"
          :to="link.to"
          :icon="link.icon"
          :label="link.label"
          :active="isActive(link.match)"
        />
      </div>

      <div class="mb-6">
        <div class="mb-2 flex items-center justify-between px-3">
          <span class="text-muted text-xs font-semibold tracking-wider uppercase">{{
            t('shell.nav.favorites')
          }}</span>
          <UButton color="neutral" variant="ghost" icon="i-lucide-plus" size="xs" square />
        </div>
        <LayoutSidebarNavItem
          v-for="fav in favorites"
          :key="fav.to"
          :to="fav.to"
          :label="fav.label"
          :active="false"
        >
          <template #icon>
            <span class="size-2 shrink-0 rounded-full" :class="fav.color" />
          </template>
        </LayoutSidebarNavItem>
      </div>
    </nav>

    <div class="border-default border-t p-4">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-plus"
        class="w-full justify-start"
        @click="openTaskCreate()"
      >
        {{ t('shell.nav.newTask') }}
      </UButton>
    </div>
  </aside>
</template>

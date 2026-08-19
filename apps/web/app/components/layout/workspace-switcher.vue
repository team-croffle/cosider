<script setup lang="ts">
  import { MODAL_IDS } from '~/constants/modal.const';

  const workspaceStore = useWorkspaceStore();
  const { t } = useI18n();
  const { open: openWorkspaceCreate } = useModal(MODAL_IDS.WORKSPACE_CREATE);

  const current = computed(() => workspaceStore.currentWorkspace);
  const initial = computed(() => (current.value?.name?.[0] ?? 'W').toUpperCase());

  onMounted(() => {
    if (!workspaceStore.workspaces.length && !workspaceStore.isLoading) {
      workspaceStore.fetchWorkspaces().catch(() => {});
    }
  });

  const menuItems = computed(() => {
    const list =
      workspaceStore.workspaces.length > 0
        ? workspaceStore.workspaces.map((ws) => ({
            label: ws.name,
            onSelect: () => {
              workspaceStore.setCurrent(ws.slug);
            },
          }))
        : [{ label: t('workspace.switcher.empty'), disabled: true }];

    return [
      list,
      [
        {
          label: t('workspace.switcher.new'),
          icon: 'i-lucide-plus',
          onSelect: () => openWorkspaceCreate(),
        },
      ],
    ];
  });
</script>

<template>
  <UDropdownMenu :items="menuItems">
    <UButton color="neutral" variant="ghost" class="gap-2 px-2">
      <span
        class="bg-primary/15 text-primary flex size-6 items-center justify-center rounded text-xs font-bold"
      >
        {{ initial }}
      </span>
      <span class="hidden max-w-40 truncate text-sm font-medium sm:inline">
        {{ current?.name ?? t('workspace.switcher.fallback') }}
      </span>
      <UIcon name="i-lucide-chevron-down" class="text-muted size-4" />
    </UButton>
  </UDropdownMenu>
</template>

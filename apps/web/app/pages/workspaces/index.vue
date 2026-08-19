<script setup lang="ts">
  import { MODAL_IDS } from '~/constants/modal.const';

  const { t, locale } = useI18n();
  const workspaceStore = useWorkspaceStore();
  const { open: openCreate } = useModal(MODAL_IDS.WORKSPACE_CREATE);

  await workspaceStore.fetchWorkspaces();

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
</script>

<template>
  <div>
    <LayoutPageHeader
      :title="t('workspace.list.title')"
      :description="t('workspace.list.description')"
    >
      <template #actions>
        <UButton icon="i-lucide-plus" @click="openCreate()">
          {{ t('workspace.list.new') }}
        </UButton>
      </template>
    </LayoutPageHeader>

    <div class="p-6">
      <div v-if="workspaceStore.isLoading" class="text-muted py-8 text-center">
        {{ t('common.loading') }}
      </div>
      <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="workspace in workspaceStore.workspaces"
          :key="workspace.slug"
          class="hover:bg-elevated transition"
        >
          <div class="mb-4 flex items-start justify-between">
            <div
              class="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
            >
              {{ workspace.name[0] }}
            </div>
            <UBadge :label="workspace.role" variant="outline" />
          </div>

          <h2 class="mb-1 text-base font-semibold">{{ workspace.name }}</h2>
          <p class="text-muted mb-4 line-clamp-2 text-sm">{{ workspace.description }}</p>

          <p class="text-muted text-xs">
            <UIcon name="i-lucide-calendar" class="mr-1" />
            {{ formatDate(workspace.createdAt) }}
          </p>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n();

  type StubNoti = {
    id: string;
    title: string;
    description: string;
    time: string;
    unread?: boolean;
    icon: string;
    iconClass?: string;
  };

  // Stub list — no notification API yet
  const items = ref<StubNoti[]>([
    {
      id: '1',
      title: 'New comment in FRID-01',
      description: "John mentioned you: 'Please check the token policy...'",
      time: '2m ago',
      unread: true,
      icon: 'i-lucide-message-square',
      iconClass: 'text-primary',
    },
    {
      id: '2',
      title: 'Stage Gate Warning',
      description: 'Design & Arch phase requires ERD documentation.',
      time: '1h ago',
      icon: 'i-lucide-circle-alert',
      iconClass: 'text-warning',
    },
    {
      id: '3',
      title: 'Build Success',
      description: "Project 'Frontend Rewrite' deployed to production.",
      time: '3h ago',
      icon: 'i-lucide-circle-check',
      iconClass: 'text-success',
    },
  ]);

  const unreadCount = computed(() => items.value.filter((i) => i.unread).length);

  function markAllRead() {
    items.value = items.value.map((i) => ({ ...i, unread: false }));
  }
</script>

<template>
  <UPopover :content="{ align: 'end', sideOffset: 8 }">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-bell"
      square
      :aria-label="t('shell.notifications.label')"
      class="relative"
    >
      <span
        v-if="unreadCount"
        class="ring-default absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2"
      />
    </UButton>

    <template #content>
      <div class="w-80">
        <div class="border-default flex items-center justify-between border-b px-4 py-3">
          <span class="text-sm font-bold">{{ t('shell.notifications.title') }}</span>
          <UButton
            size="xs"
            color="primary"
            variant="link"
            class="tracking-tighter uppercase"
            @click="markAllRead"
          >
            {{ t('shell.notifications.markAllRead') }}
          </UButton>
        </div>
        <div class="max-h-96 overflow-y-auto">
          <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="hover:bg-elevated relative flex w-full gap-3 px-4 py-3 text-left transition-colors"
            :class="item.unread ? 'bg-primary/5' : ''"
          >
            <UIcon :name="item.icon" class="mt-1 size-4 shrink-0" :class="item.iconClass" />
            <div class="min-w-0 flex-1">
              <p class="truncate pr-6 text-sm font-bold">{{ item.title }}</p>
              <p class="text-muted mt-0.5 line-clamp-2 text-xs">{{ item.description }}</p>
              <p class="text-muted mt-1 text-[10px] font-medium">{{ item.time }}</p>
            </div>
            <span
              v-if="item.unread"
              class="bg-primary absolute top-4 right-4 size-1.5 rounded-full"
            />
          </button>
        </div>
      </div>
    </template>
  </UPopover>
</template>

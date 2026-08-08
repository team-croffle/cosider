<script setup lang="ts">
  type ProjectPage = 'board' | 'requirements' | 'apis' | 'tests' | 'traceability';

  const props = defineProps<{
    projectId: string;
    activePage: ProjectPage;
  }>();

  const links = computed(() => [
    {
      page: 'board' as const,
      to: `/projects/${props.projectId}/board`,
      icon: 'i-lucide-layout-template',
      label: 'Board',
      count: 24,
    },
    {
      page: 'requirements' as const,
      to: `/projects/${props.projectId}/requirements`,
      icon: 'i-lucide-file-text',
      label: 'Requirements',
      count: 12,
    },
    {
      page: 'apis' as const,
      to: `/projects/${props.projectId}/apis`,
      icon: 'i-lucide-code-2',
      label: 'API Docs',
      count: 8,
    },
    {
      page: 'tests' as const,
      to: `/projects/${props.projectId}/tests`,
      icon: 'i-lucide-test-tube-2',
      label: 'Test Cases',
      count: 42,
    },
    {
      page: 'traceability' as const,
      to: `/projects/${props.projectId}/traceability`,
      icon: 'i-lucide-circle-check-big',
      label: 'Traceability',
    },
  ]);
</script>

<template>
  <aside
    class="hidden w-(--cosider-project-sidebar-width) shrink-0 overflow-y-auto border-r border-neutral-200 bg-white md:block dark:border-neutral-800 dark:bg-neutral-950"
  >
    <nav class="space-y-1 p-3">
      <template v-for="(link, index) in links" :key="link.page">
        <USeparator v-if="link.page === 'traceability' && index > 0" class="my-2" />
        <LayoutSidebarNavItem
          :to="link.to"
          :icon="link.icon"
          :label="link.label"
          :count="link.count"
          :active="activePage === link.page"
        />
      </template>
    </nav>
  </aside>
</template>

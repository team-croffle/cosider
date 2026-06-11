<script setup lang="ts">
  import type { EWorkspaceStatus, EWorkspaceUserRole, IWorkspaceResponse } from '@cosider/shared';

  const isCreateModalOpen = ref(false);

  // TODO: API 연결 후 제거 (useWorkspace composable로 교체)
  const workspaces: IWorkspaceResponse[] = [
    {
      slug: 'my-workspace',
      name: 'My Workspace',
      description: 'Personal workspace for all individual projects and tasks.',
      status: 'ACTIVE' as EWorkspaceStatus,
      role: 'OWNER' as EWorkspaceUserRole,
      logoUrl: '',
      createdAt: '2024-01-15T00:00:00Z',
    },
    {
      slug: 'team-alpha',
      name: 'Team Alpha',
      description: "Collaborative space for the Alpha product team's sprints.",
      status: 'ACTIVE' as EWorkspaceStatus,
      role: 'ADMIN' as EWorkspaceUserRole,
      logoUrl: '',
      createdAt: '2024-03-02T00:00:00Z',
    },
    {
      slug: 'design-system',
      name: 'Design System',
      description: 'Component library, tokens, and design guidelines.',
      status: 'ACTIVE' as EWorkspaceStatus,
      role: 'MEMBER' as EWorkspaceUserRole,
      logoUrl: '',
      createdAt: '2024-05-10T00:00:00Z',
    },
  ];

  // 날짜 포맷 함수
  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
</script>

<template>
  <div class="p-8">
    <!-- 헤더 -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Workspaces</h1>
        <p class="mt-1 text-sm text-gray-400">Manage your workspaces</p>
      </div>
      <UButton @click="isCreateModalOpen = true"> + New Workspace </UButton>
    </div>

    <!-- 카드 그리드 -->
    <!-- TODO: 워크스페이스 목록이 비어있을 때 보여줄 UI 추가 필요 -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-for="workspace in workspaces"
        :key="workspace.slug"
        class="transition hover:bg-white/10"
      >
        <!-- 로고 + 역할 뱃지 -->
        <div class="mb-4 flex items-start justify-between">
          <!-- TODO: 워크스페이스별 로고 없을 시 이니셜 + 나중에 디자인 시스템 색상 변수로 교체 필요 -->
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-lg font-bold"
          >
            {{ workspace.name[0] }}
          </div>
          <UBadge :label="workspace.role" variant="outline" />
        </div>

        <!-- 이름 + 설명 -->
        <h2 class="mb-1 text-base font-semibold">{{ workspace.name }}</h2>
        <p class="mb-4 line-clamp-2 text-sm text-gray-400">{{ workspace.description }}</p>

        <!-- 생성일 -->
        <p class="text-xs text-gray-500">
          <UIcon name="i-lucide-calendar" class="mr-1" />
          {{ formatDate(workspace.createdAt) }}
        </p>
      </UCard>
    </div>

    <WorkspaceCreateModal v-model="isCreateModalOpen" />
  </div>
</template>

<template>
  <div class="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950">
    <LayoutAppGnb />
    <div class="flex min-h-0 flex-1 overflow-hidden">
      <LayoutAppLnb />
      <UMain class="min-h-0 flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950">
        <slot />
      </UMain>
    </div>

    <OverlayConfirm />
    <OverlayTaskCreateDrawer />
    <WorkspaceCreateModalHost />
  </div>
</template>

<script setup lang="ts"></script>

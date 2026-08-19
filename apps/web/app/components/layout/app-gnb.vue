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
      <LocaleSwitcher />
      <UColorModeButton />
      <LayoutNotificationPopover />
      <LayoutUserMenu />
    </div>
  </header>
</template>

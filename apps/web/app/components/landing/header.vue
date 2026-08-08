<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';

  const items = [
    {
      label: 'Features',
      to: '/#features',
    },
    {
      label: 'Resources',
      children: [
        {
          label: 'Docs',
          description: 'API reference and product documentation for Cosider.',
          icon: 'i-lucide-book-open',
          to: '/docs',
        },
        {
          label: 'Guide',
          description: 'Step-by-step guides to set up workspaces and projects.',
          icon: 'i-lucide-compass',
          to: '/guide',
        },
      ],
    },
    {
      label: 'Pricing',
      to: '/pricing',
    },
  ] satisfies NavigationMenuItem[];
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="flex items-center">
        <AppLogo />
      </NuxtLink>
    </template>

    <template #default>
      <UNavigationMenu
        :items="items"
        class="hidden lg:flex"
        content-orientation="vertical"
        :ui="{
          list: 'gap-2',
          childLinkIcon: 'text-primary size-5 shrink-0',
          childLinkDescription: 'text-muted text-sm',
        }"
      />
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        to="https://github.com/team-croffle/cosider"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />

      <UButton to="/auth/login" color="neutral" variant="ghost" class="hidden sm:inline-flex">
        Login
      </UButton>
      <UButton to="/auth/signup" color="primary"> Get started </UButton>
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
        :ui="{
          childLinkIcon: 'text-primary size-5 shrink-0',
          childLinkDescription: 'text-muted text-sm',
        }"
      />
      <USeparator class="my-4" />
      <div class="flex flex-col gap-2">
        <UButton to="/auth/login" color="neutral" variant="ghost" block> Login </UButton>
        <UButton to="/auth/signup" color="primary" block> Get started </UButton>
      </div>
    </template>
  </UHeader>
</template>

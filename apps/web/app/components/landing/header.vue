<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';

  const { t } = useI18n();

  const items = computed(
    () =>
      [
        {
          label: t('landing.nav.features'),
          to: '/#features',
        },
        {
          label: t('landing.nav.resources'),
          children: [
            {
              label: t('landing.nav.docs'),
              description: t('landing.nav.docsDescription'),
              icon: 'i-lucide-book-open',
              to: '/docs',
            },
            {
              label: t('landing.nav.guide'),
              description: t('landing.nav.guideDescription'),
              icon: 'i-lucide-compass',
              to: '/guide',
            },
          ],
        },
        {
          label: t('landing.nav.pricing'),
          to: '/pricing',
        },
      ] satisfies NavigationMenuItem[],
  );
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
      <LocaleSwitcher />
      <UColorModeButton />

      <UButton
        to="https://github.com/team-croffle/cosider"
        target="_blank"
        icon="i-simple-icons-github"
        :aria-label="t('landing.nav.github')"
        color="neutral"
        variant="ghost"
      />

      <UButton to="/auth/login" color="neutral" variant="ghost" class="hidden sm:inline-flex">
        {{ t('landing.nav.login') }}
      </UButton>
      <UButton to="/auth/signup" color="primary">{{ t('landing.nav.getStarted') }}</UButton>
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
        <UButton to="/auth/login" color="neutral" variant="ghost" block>
          {{ t('landing.nav.login') }}
        </UButton>
        <UButton to="/auth/signup" color="primary" block>
          {{ t('landing.nav.getStarted') }}
        </UButton>
      </div>
    </template>
  </UHeader>
</template>

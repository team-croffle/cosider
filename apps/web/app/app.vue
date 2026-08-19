<script setup>
  const { locale, t } = useI18n();

  useHead({
    meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
    htmlAttrs: {
      lang: locale,
    },
  });

  const title = computed(() => t('seo.title'));
  const description = computed(() => t('seo.description'));

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    twitterCard: 'summary',
  });
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- App-shell overlays: layout-agnostic hosts -->
    <OverlayConfirm />
    <OverlayTaskCreateDrawer />
    <WorkspaceCreateModalHost />
  </UApp>
</template>

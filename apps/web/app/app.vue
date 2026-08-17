<script setup>
  useHead({
    meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
    htmlAttrs: {
      lang: 'en',
    },
  });

  const title = 'Cosider';
  const description = '기획부터 유지보수까지, 프로젝트 전 과정을 추적하는 협업 툴';

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    twitterCard: 'summary_large_image',
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

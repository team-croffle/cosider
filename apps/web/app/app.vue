<script setup>
  useHead({
    meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    link: [{ rel: 'icon', href: '/favicon.ico' }],
    htmlAttrs: {
      lang: 'en',
    },
  });

  const title = 'Cosider';
  const description = 'Manage your projects and tasks in one place';

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
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

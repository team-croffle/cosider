<template>
  <div>
    <UPageHero
      :title="t('landing.hero.title')"
      :description="t('landing.hero.description')"
      :links="heroLinks"
    />

    <UPageSection
      id="features"
      :title="t('landing.features.title')"
      :description="t('landing.features.description')"
      :features="featureItems"
    />

    <UPageSection>
      <UPageCTA
        :title="t('landing.cta.title')"
        :description="t('landing.cta.description')"
        variant="subtle"
        :links="ctaLinks"
      />
    </UPageSection>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'landing',
  });

  const { t } = useI18n();

  const heroLinks = computed(() => [
    {
      label: t('landing.nav.getStarted'),
      to: '/auth/signup',
      trailingIcon: 'i-lucide-arrow-right',
      size: 'xl' as const,
    },
    {
      label: t('landing.nav.github'),
      to: 'https://github.com/team-croffle/cosider',
      target: '_blank',
      icon: 'i-simple-icons-github',
      size: 'xl' as const,
      color: 'neutral' as const,
      variant: 'subtle' as const,
    },
  ]);

  const featureItems = computed(() => [
    {
      icon: 'i-lucide-waypoints',
      title: t('landing.features.traceability.title'),
      description: t('landing.features.traceability.description'),
    },
    {
      icon: 'i-lucide-milestone',
      title: t('landing.features.gate.title'),
      description: t('landing.features.gate.description'),
    },
    {
      icon: 'i-lucide-pen-line',
      title: t('landing.features.docs.title'),
      description: t('landing.features.docs.description'),
    },
    {
      icon: 'i-lucide-users',
      title: t('landing.features.workspace.title'),
      description: t('landing.features.workspace.description'),
    },
  ]);

  const ctaLinks = computed(() => [
    {
      label: t('landing.nav.getStarted'),
      to: '/auth/signup',
      trailingIcon: 'i-lucide-arrow-right',
      color: 'neutral' as const,
    },
    {
      label: t('landing.nav.github'),
      to: 'https://github.com/team-croffle/cosider',
      target: '_blank',
      icon: 'i-simple-icons-github',
      color: 'neutral' as const,
      variant: 'outline' as const,
    },
  ]);
</script>

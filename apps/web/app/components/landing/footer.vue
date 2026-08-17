<script setup lang="ts">
  const { t } = useI18n();
  const year = new Date().getFullYear();
</script>

<template>
  <UFooter>
    <template #left>
      <div class="flex flex-col gap-2">
        <AppLogo class="opacity-90" />
        <p class="text-muted text-sm">{{ t('landing.footer.tagline') }}</p>
        <p class="text-muted text-xs">© {{ year }} Croffle Dev.</p>
      </div>
    </template>

    <template #right>
      <div class="flex flex-wrap items-center gap-1">
        <UButton to="/terms" color="neutral" variant="link" size="sm">
          {{ t('landing.footer.terms') }}
        </UButton>
        <UButton to="/privacy" color="neutral" variant="link" size="sm">
          {{ t('landing.footer.privacy') }}
        </UButton>
        <UButton
          to="https://github.com/team-croffle/cosider"
          target="_blank"
          icon="i-simple-icons-github"
          :aria-label="t('landing.nav.github')"
          color="neutral"
          variant="ghost"
        />
      </div>
    </template>
  </UFooter>
</template>

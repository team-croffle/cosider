<script setup lang="ts">
  const year = new Date().getFullYear();
</script>

<template>
  <UFooter>
    <template #left>
      <div class="flex flex-col gap-2">
        <AppLogo class="opacity-90" />
        <p class="text-muted text-sm">Track projects from planning to maintenance.</p>
        <p class="text-muted text-xs">© {{ year }} Croffle Dev.</p>
      </div>
    </template>

    <template #right>
      <div class="flex flex-wrap items-center gap-1">
        <UButton to="/terms" color="neutral" variant="link" size="sm"> Terms </UButton>
        <UButton to="/privacy" color="neutral" variant="link" size="sm"> Privacy </UButton>
        <UButton
          to="https://github.com/team-croffle/cosider"
          target="_blank"
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          aria-label="GitHub"
        />
      </div>
    </template>
  </UFooter>
</template>

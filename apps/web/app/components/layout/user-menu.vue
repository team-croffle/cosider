<script setup lang="ts">
  const { user, isAuthenticated, signOut } = useAuth();
  const { t } = useI18n();

  const displayName = computed(() => user.value?.nickname ?? t('shell.user.fallbackName'));
  const initial = computed(() => displayName.value.charAt(0).toUpperCase());

  async function onLogout() {
    try {
      await signOut();
      await navigateTo('/');
    } catch {
      // ignore
    }
  }

  const items = computed(() => [
    [
      {
        label: t('shell.user.profile'),
        icon: 'i-lucide-user',
        to: '/settings/profile',
      },
      {
        label: t('shell.user.settings'),
        icon: 'i-lucide-settings',
        to: '/settings',
      },
    ],
    [
      {
        label: t('shell.user.logout'),
        icon: 'i-lucide-log-out',
        color: 'error' as const,
        onSelect: onLogout,
      },
    ],
  ]);
</script>

<template>
  <UDropdownMenu v-if="isAuthenticated" :items="items">
    <UButton
      color="neutral"
      variant="ghost"
      class="rounded-full p-1"
      square
      :aria-label="displayName"
    >
      <UAvatar :alt="displayName" size="sm" :text="initial" />
    </UButton>
  </UDropdownMenu>
  <UButton v-else to="/auth/login" color="neutral" variant="ghost" size="sm">
    {{ t('common.login') }}
  </UButton>
</template>

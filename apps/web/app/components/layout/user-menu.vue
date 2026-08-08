<script setup lang="ts">
  const { user, isAuthenticated, signOut } = useAuth();

  const displayName = computed(() => user.value?.nickname ?? 'User');
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
        label: 'My profile',
        icon: 'i-lucide-user',
        to: '/settings/profile',
      },
      {
        label: 'Settings',
        icon: 'i-lucide-settings',
        to: '/settings',
      },
    ],
    [
      {
        label: 'Logout',
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
  <UButton v-else to="/auth/login" color="neutral" variant="ghost" size="sm"> Login </UButton>
</template>

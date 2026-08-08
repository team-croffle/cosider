<script setup lang="ts">
  withDefaults(
    defineProps<{
      to?: string;
      icon?: string;
      label: string;
      active?: boolean;
      count?: number;
    }>(),
    {
      active: false,
    },
  );
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
    :class="active ? 'bg-primary/10 text-primary' : 'text-default hover:bg-elevated'"
  >
    <span class="flex min-w-0 items-center gap-3">
      <UIcon v-if="icon" :name="icon" class="size-4 shrink-0" />
      <slot name="icon" />
      <span class="truncate">{{ label }}</span>
    </span>
    <UBadge
      v-if="count != null"
      :label="String(count)"
      size="sm"
      color="neutral"
      variant="subtle"
    />
  </NuxtLink>
  <button
    v-else
    type="button"
    class="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
    :class="active ? 'bg-primary/10 text-primary' : 'text-default hover:bg-elevated'"
  >
    <span class="flex min-w-0 items-center gap-3">
      <UIcon v-if="icon" :name="icon" class="size-4 shrink-0" />
      <slot name="icon" />
      <span class="truncate">{{ label }}</span>
    </span>
    <UBadge
      v-if="count != null"
      :label="String(count)"
      size="sm"
      color="neutral"
      variant="subtle"
    />
  </button>
</template>

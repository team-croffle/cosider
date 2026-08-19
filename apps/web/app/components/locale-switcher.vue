<script setup lang="ts">
  const { locale, locales, setLocale, t } = useI18n();
  const open = ref(false);

  const localeOptions = computed(() =>
    locales.value.map((item) => {
      if (typeof item === 'string') {
        return { code: item, name: item };
      }
      return { code: item.code, name: item.name ?? item.code };
    }),
  );

  async function choose(code: string) {
    await setLocale(code);
    open.value = false;
  }
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'end' }">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-languages"
      square
      :aria-label="t('common.language')"
    />
    <template #content>
      <div class="w-40 p-2">
        <p class="text-muted px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
          {{ t('common.language') }}
        </p>
        <UButton
          v-for="item in localeOptions"
          :key="item.code"
          block
          color="neutral"
          :variant="locale === item.code ? 'soft' : 'ghost'"
          size="sm"
          class="justify-between"
          @click="choose(item.code)"
        >
          {{ item.name }}
          <UIcon v-if="locale === item.code" name="i-lucide-check" class="text-primary size-3" />
        </UButton>
      </div>
    </template>
  </UPopover>
</template>

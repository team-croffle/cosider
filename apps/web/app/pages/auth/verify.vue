<script setup lang="ts">
  const route = useRoute();

  const loading = ref(true);
  const success = ref(false);
  const errorMessage = ref('');

  onMounted(async () => {
    const token = route.query.token;

    if (typeof token !== 'string' || !token) {
      errorMessage.value = '인증 토큰이 존재하지 않습니다.';
      loading.value = false;
      return;
    }

    try {
      await $fetch('/api/v1/auth/verify', {
        method: 'POST',
        body: {
          token,
        },
      });

      success.value = true;
    } catch {
      errorMessage.value = '인증 링크가 만료되었거나 유효하지 않습니다.';
    } finally {
      loading.value = false;
    }
  });
</script>

<template>
  <div>
    <div v-if="loading">이메일 인증 중...</div>

    <div v-else-if="success">이메일 인증이 완료되었습니다.</div>

    <div v-else>
      {{ errorMessage }}
    </div>
  </div>
</template>

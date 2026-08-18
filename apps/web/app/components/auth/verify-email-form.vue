<script setup lang="ts">
  const route = useRoute();
  const { $api } = useNuxtApp();

  const token = computed(() => route.query.token as string);

  type VerifyStatus = 'idle' | 'verifying' | 'success' | 'error';
  const status = ref<VerifyStatus>('idle');
  const errorMessage = ref<string | null>(null);

  async function verify() {
    if (!token.value) {
      status.value = 'error';
      errorMessage.value = '인증 토큰이 누락되었습니다. 메일함의 링크를 다시 확인해 주세요.';
      return;
    }

    status.value = 'verifying';
    try {
      await $api('/api/v1/auth/verify-email', {
        method: 'POST',
        body: { token: token.value },
      });
      status.value = 'success';
    } catch (error: any) {
      status.value = 'error';
      const errorMsg = error?.data?.message || error?.message || '이메일 인증에 실패했습니다.';
      if (error?.data?.errorCode === 'INVALID_TOKEN') {
        errorMessage.value = '만료되었거나 유효하지 않은 인증 토큰입니다.';
      } else if (error?.data?.errorCode === 'ALREADY_REGISTERED') {
        errorMessage.value =
          '이미 인증이 완료된 계정입니다. 로그인 페이지로 이동하여 로그인해 주세요.';
      } else {
        errorMessage.value = errorMsg;
      }
    }
  }

  onMounted(() => {
    verify();
  });
</script>

<template>
  <div class="flex w-full flex-col items-center py-6 text-center">
    <!-- 1. 인증 중 상태 -->
    <div v-if="status === 'verifying' || status === 'idle'" class="flex flex-col items-center">
      <div class="mb-4 flex h-14 w-14 items-center justify-center">
        <UIcon name="i-lucide-loader-2" class="h-10 w-10 animate-spin text-blue-500" />
      </div>
      <h3 class="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
        이메일 인증 진행 중
      </h3>
      <p class="max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        이메일 인증 토큰을 확인하고 있습니다. 잠시만 기다려 주세요...
      </p>
    </div>

    <!-- 2. 인증 성공 상태 -->
    <div v-else-if="status === 'success'" class="flex flex-col items-center">
      <div
        class="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-green-800/40 bg-green-950/20 text-green-500"
      >
        <UIcon name="i-lucide-check-circle" class="h-8 w-8" />
      </div>
      <h3 class="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
        이메일 인증 완료
      </h3>
      <p class="mb-6 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        이메일 인증이 성공적으로 완료되었습니다! 이제 로그인하여 서비스를 이용하실 수 있습니다.
      </p>
      <UButton
        to="/auth/signin"
        color="primary"
        size="md"
        class="flex w-full cursor-pointer items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98]"
      >
        로그인 페이지로 이동
      </UButton>
    </div>

    <!-- 3. 인증 실패 상태 -->
    <div v-else-if="status === 'error'" class="flex flex-col items-center">
      <div
        class="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-800/40 bg-red-950/20 text-red-500"
      >
        <UIcon name="i-lucide-x-circle" class="h-8 w-8" />
      </div>
      <h3 class="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
        이메일 인증 실패
      </h3>
      <p
        class="mb-6 max-w-sm rounded-lg border border-red-900/30 bg-red-950/10 p-3 text-center text-sm leading-relaxed text-red-500"
      >
        {{ errorMessage }}
      </p>
      <div class="flex w-full flex-col gap-3">
        <UButton
          to="/auth/signup"
          color="neutral"
          variant="outline"
          size="md"
          class="flex w-full cursor-pointer items-center justify-center border border-neutral-800 transition-all duration-200 hover:bg-neutral-900/50 hover:text-neutral-100 active:scale-[0.98]"
        >
          회원가입 다시 시도
        </UButton>
        <UButton
          to="/auth/signin"
          color="neutral"
          variant="link"
          size="xs"
          class="text-neutral-500 transition-all duration-200 hover:text-neutral-300"
        >
          로그인 페이지로 이동
        </UButton>
      </div>
    </div>
  </div>
</template>

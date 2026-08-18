<script setup lang="ts">
  useSeoMeta({
    title: '이메일 인증 - Cosider',
    description: '이메일 인증을 진행하여 Cosider 서비스 가입을 완료해 주세요.',
  });
</script>

<template>
  <div
    class="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8"
  >
    <!-- 이메일 인증 카드 컨테이너 -->
    <div
      class="flex w-full max-w-md flex-col items-center rounded-xl border border-neutral-200 bg-white p-8 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/50"
    >
      <!-- 로고 및 헤더 -->
      <div class="mb-6 flex flex-col items-center text-center select-none">
        <AppLogo class="mb-4 h-12 w-auto text-blue-600 dark:text-blue-500" />
      </div>

      <!-- 이메일 인증 폼/상태 컴포넌트 -->
      <AuthVerifyEmailForm />
    </div>
  </div>
</template>

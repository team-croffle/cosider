<script setup lang="ts">
  useSeoMeta({
    title: '회원가입 - Cosider',
    description: 'Cosider 서비스의 일원이 되어 나만의 스마트 워크스페이스를 경험해 보세요.',
  });

  // 이미 로그인된 사용자는 메인 화면으로 리다이렉트
  const { isAuthenticated } = useAuth();
  if (isAuthenticated.value) {
    navigateTo('/');
  }
</script>

<template>
  <div
    class="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8"
  >
    <!-- 회원가입 카드 컨테이너 -->
    <div
      class="flex w-full max-w-md flex-col items-center rounded-xl border border-neutral-200 bg-white p-8 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/50"
    >
      <!-- 로고 및 헤더 -->
      <div class="mb-8 flex flex-col items-center text-center select-none">
        <!-- 추후 로고 변경 -->
        <AppLogo class="mb-4 h-12 w-auto text-blue-600 dark:text-blue-500" />
        <h2 class="text-xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100">
          Sign Up to Cosider
        </h2>
      </div>

      <!-- 회원가입 폼 컴포넌트 -->
      <AuthSignupForm />

      <!-- 하단 안내 링크 -->
      <div class="mt-6 text-center text-xs text-neutral-500 select-none dark:text-neutral-400">
        이미 계정이 있으신가요?
        <NuxtLink
          to="/auth/signin"
          class="ml-1 cursor-pointer font-semibold text-blue-600 transition-all duration-200 hover:underline dark:text-blue-500"
        >
          Sign In
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

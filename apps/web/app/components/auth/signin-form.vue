<script setup lang="ts">
  import type { IAuthorizeDto } from '@cosider/shared';
  import type { FormError, FormSubmitEvent } from '@nuxt/ui';

  const { signInWithLocal, signInWithOAuth } = useAuth();

  const form = reactive<IAuthorizeDto>({
    email: '',
    password: '',
  });

  const showPassword = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  // 이메일 유효성 검사 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 클라이언트 사이드 유효성 검사
  function validate(state: typeof form): FormError[] {
    const errors: FormError[] = [];

    if (!state.email) {
      errors.push({ name: 'email', message: '이메일을 입력해 주세요.' });
    } else if (!emailRegex.test(state.email)) {
      errors.push({ name: 'email', message: '올바른 이메일 형식이 아닙니다.' });
    }

    if (!state.password) {
      errors.push({ name: 'password', message: '비밀번호를 입력해 주세요.' });
    } else if (state.password.length < 8) {
      errors.push({ name: 'password', message: '비밀번호는 최소 8자 이상이어야 합니다.' });
    }

    return errors;
  }

  async function onSubmit(event: FormSubmitEvent<typeof form>) {
    isLoading.value = true;
    errorMessage.value = null;
    try {
      await signInWithLocal(event.data);
      // 로그인 성공 시 루트 페이지로 리다이렉트
      navigateTo('/');
    } catch (error: any) {
      // 에러 코드나 메시지에 따라 알맞게 노출
      const errorMsg = error?.data?.message || error?.message || '로그인에 실패했습니다.';
      if (errorMsg === 'ERR_PENDING_LEAVE_ACCOUNT') {
        errorMessage.value = '탈퇴 진행 중인 계정입니다.';
      } else if (errorMsg === 'ERR_LEAVED_ACCOUNT') {
        errorMessage.value = '탈퇴 완료된 계정입니다.';
      } else if (errorMsg === 'ERR_BANNED_ACCOUNT') {
        errorMessage.value = '정지된 계정입니다.';
      } else if (errorMsg === 'ERR_INACTIVE_ACCOUNT') {
        errorMessage.value = '비활성화된 계정입니다.';
      } else {
        errorMessage.value = '이메일 또는 비밀번호가 올바르지 않습니다.';
      }
    } finally {
      isLoading.value = false;
    }
  }

  function handleOAuth(provider: 'google' | 'github') {
    signInWithOAuth(provider);
  }
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <!-- 에러 배너 -->
    <div
      v-if="errorMessage"
      class="rounded-lg border border-red-900/40 bg-red-950/20 p-3.5 text-center text-sm font-medium text-red-500 transition-all duration-300"
    >
      {{ errorMessage }}
    </div>

    <!-- 로그인 폼 -->
    <UForm
      id="signin-form"
      :validate="validate"
      :state="form"
      class="flex flex-col gap-4"
      @submit="onSubmit"
    >
      <!-- 이메일 입력 -->
      <UFormField label="이메일" name="email" required>
        <UInput
          v-model="form.email"
          type="email"
          icon="i-lucide-mail"
          placeholder="example@cosider.com"
          class="w-full"
          :disabled="isLoading"
          size="md"
        />
      </UFormField>

      <!-- 비밀번호 입력 -->
      <UFormField label="비밀번호" name="password" required>
        <UInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          icon="i-lucide-lock"
          placeholder="••••••••"
          class="relative w-full"
          :disabled="isLoading"
          size="md"
          :ui="{ trailing: 'pr-1' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="ghost"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              class="min-h-0 p-1 text-neutral-400 hover:text-neutral-200 focus:outline-none"
              :disabled="isLoading"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <!-- 로그인 제출 버튼 -->
      <UButton
        type="submit"
        form="signin-form"
        color="primary"
        size="md"
        class="mt-2 flex w-full cursor-pointer items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98]"
        :loading="isLoading"
      >
        이메일로 로그인
      </UButton>
    </UForm>

    <!-- 구분선 -->
    <div class="relative flex items-center py-2">
      <div class="flex-grow border-t border-neutral-800"></div>
      <span class="mx-4 flex-shrink text-xs font-medium text-neutral-400 select-none">또는</span>
      <div class="flex-grow border-t border-neutral-800"></div>
    </div>

    <!-- 소셜 로그인 버튼 -->
    <div class="flex flex-col gap-3">
      <!-- 구글 로그인 -->
      <UButton
        icon="i-simple-icons-google"
        variant="outline"
        color="neutral"
        size="md"
        class="flex w-full cursor-pointer items-center justify-center border border-neutral-800 font-medium transition-all duration-200 hover:bg-neutral-900/50 hover:text-neutral-100 active:scale-[0.98]"
        :disabled="isLoading"
        @click="handleOAuth('google')"
      >
        Google
      </UButton>

      <!-- 깃허브 로그인 -->
      <UButton
        icon="i-simple-icons-github"
        variant="outline"
        color="neutral"
        size="md"
        class="flex w-full cursor-pointer items-center justify-center border border-neutral-800 font-medium transition-all duration-200 hover:bg-neutral-900/50 hover:text-neutral-100 active:scale-[0.98]"
        :disabled="isLoading"
        @click="handleOAuth('github')"
      >
        GitHub
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ISignupRequest } from '@cosider/shared';
  import type { FormError, FormSubmitEvent } from '@nuxt/ui';

  const { $api } = useNuxtApp();

  const form = reactive<ISignupRequest>({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const showPassword = ref(false);
  const showPasswordConfirm = ref(false);
  const isLoading = ref(false);
  const isSubmitted = ref(false);
  const submittedEmail = ref('');
  const errorMessage = ref<string | null>(null);

  // 이메일 유효성 검사 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 비밀번호 강도 검사 (최소 8자, 소문자 1개, 숫자 1개, 특수문자 1개 포함)
  const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  function validate(state: typeof form): FormError[] {
    const errors: FormError[] = [];

    // 이메일 검증
    if (!state.email) {
      errors.push({ name: 'email', message: '이메일을 입력해 주세요.' });
    } else if (!emailRegex.test(state.email)) {
      errors.push({ name: 'email', message: '올바른 이메일 형식이 아닙니다.' });
    }

    // 비밀번호 검증
    if (!state.password) {
      errors.push({ name: 'password', message: '비밀번호를 입력해 주세요.' });
    } else if (!passwordRegex.test(state.password)) {
      errors.push({
        name: 'password',
        message: '비밀번호는 영문 소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.',
      });
    }

    // 비밀번호 확인 검증
    if (!state.passwordConfirm) {
      errors.push({ name: 'passwordConfirm', message: '비밀번호 확인을 입력해 주세요.' });
    } else if (state.password !== state.passwordConfirm) {
      errors.push({ name: 'passwordConfirm', message: '비밀번호가 일치하지 않습니다.' });
    }

    return errors;
  }

  async function onSubmit(event: FormSubmitEvent<typeof form>) {
    isLoading.value = true;
    errorMessage.value = null;
    try {
      await $api('/api/v1/auth/sign-up', {
        method: 'POST',
        body: event.data,
      });
      submittedEmail.value = event.data.email;
      isSubmitted.value = true;
    } catch (error: any) {
      const errorMsg = error?.data?.message || error?.message || '회원가입에 실패했습니다.';
      if (error?.data?.errorCode === 'ACCOUNT_ALREADY_EXISTS') {
        errorMessage.value = '이미 등록된 이메일 주소입니다.';
      } else if (error?.data?.errorCode === 'REQUIRE_SOCIAL_LINKING') {
        errorMessage.value = '이미 소셜 로그인으로 가입된 계정입니다. 소셜 로그인을 이용해 주세요.';
      } else {
        errorMessage.value = errorMsg;
      }
    } finally {
      isLoading.value = false;
    }
  }
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <!-- 가입 성공 완료 화면 -->
    <div v-if="isSubmitted" class="flex flex-col items-center py-4 text-center">
      <div
        class="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-green-800/40 bg-green-950/20 text-green-500"
      >
        <UIcon name="i-lucide-mail" class="h-7 w-7" />
      </div>
      <h3 class="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
        인증 메일 전송 완료
      </h3>
      <p class="mb-6 max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        <span class="font-semibold text-neutral-800 dark:text-neutral-200">{{
          submittedEmail
        }}</span>
        주소로 인증 링크를 발송했습니다. 메일함의 링크를 클릭하여 인증을 마쳐주세요.
      </p>
      <UButton
        to="/auth/signin"
        color="neutral"
        variant="outline"
        size="md"
        class="flex w-full cursor-pointer items-center justify-center border border-neutral-800 transition-all duration-200 hover:bg-neutral-900/50 hover:text-neutral-100 active:scale-[0.98]"
      >
        로그인 화면으로 이동
      </UButton>
    </div>

    <!-- 가입 작성 폼 -->
    <div v-else class="flex w-full flex-col gap-6">
      <!-- 에러 배너 -->
      <div
        v-if="errorMessage"
        class="rounded-lg border border-red-900/40 bg-red-950/20 p-3.5 text-center text-sm font-medium text-red-500 transition-all duration-300"
      >
        {{ errorMessage }}
      </div>

      <UForm
        id="signup-form"
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
          <template #help>
            <span class="text-[10px] leading-tight text-neutral-500 dark:text-neutral-400">
              영문 소문자, 숫자, 특수문자를 모두 포함하여 8자 이상이어야 합니다.
            </span>
          </template>
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

        <!-- 비밀번호 확인 입력 -->
        <UFormField label="비밀번호 확인" name="passwordConfirm" required>
          <UInput
            v-model="form.passwordConfirm"
            :type="showPasswordConfirm ? 'text' : 'password'"
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
                :icon="showPasswordConfirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                class="min-h-0 p-1 text-neutral-400 hover:text-neutral-200 focus:outline-none"
                :disabled="isLoading"
                @click="showPasswordConfirm = !showPasswordConfirm"
              />
            </template>
          </UInput>
        </UFormField>

        <!-- 제출 버튼 -->
        <UButton
          type="submit"
          form="signup-form"
          color="primary"
          size="md"
          class="mt-2 flex w-full cursor-pointer items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98]"
          :loading="isLoading"
        >
          회원가입 완료
        </UButton>
      </UForm>
    </div>
  </div>
</template>

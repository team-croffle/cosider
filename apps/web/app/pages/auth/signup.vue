<script setup lang="ts">
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const passwordConfirm = ref('');
  const loading = ref(false);
  const message = ref('');
  const error = ref('');

  const submit = async () => {
    loading.value = true;
    message.value = '';
    error.value = '';

    if (password.value !== passwordConfirm.value) {
      error.value = '비밀번호가 일치하지 않습니다.';
      loading.value = false;
      return;
    }

    try {
      await $fetch('/api/v1/auth/signup', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value,
          passwordConfirm: passwordConfirm.value,
        },
      });

      message.value = '회원가입이 완료되었습니다. 이메일 인증 후 로그인 해주세요.';
      email.value = '';
      password.value = '';
      passwordConfirm.value = '';
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = '회원가입에 실패했습니다. 다시 시도해주세요.';
      }
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <section class="mx-auto max-w-lg p-6">
    <h1 class="mb-6 text-3xl font-bold">회원가입</h1>

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="mb-2 block font-semibold" for="email">이메일</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="example@example.com"
          required
          class="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label class="mb-2 block font-semibold" for="password">비밀번호</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="8~20자, 영문/숫자 포함"
          required
          class="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:outline-none"
        />
      </div>

      <div>
        <label class="mb-2 block font-semibold" for="passwordConfirm">비밀번호 확인</label>
        <input
          id="passwordConfirm"
          v-model="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          required
          class="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-slate-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-lg bg-slate-900 px-4 py-3 text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {{ loading ? '가입 중...' : '회원가입' }}
      </button>
    </form>

    <div class="mt-6 space-y-2 text-sm text-slate-600">
      <p v-if="message" class="text-green-600">{{ message }}</p>
      <p v-if="error" class="text-red-600">{{ error }}</p>
      <p>
        이미 계정이 있으신가요?
        <NuxtLink to="/auth/signin" class="text-slate-900 underline">로그인</NuxtLink>
      </p>
    </div>
  </section>
</template>

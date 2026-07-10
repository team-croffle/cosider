import type { IAuthorizeDto, IAuthUserResponse } from '@cosider/shared';

import type { OAuthProvider } from '~/constants/auth.const';

export function useAuth() {
  const user = useState<IAuthUserResponse | null>('authenticated-user', () => null);
  const isAuthenticated = computed(() => !!user.value);

  const config = useRuntimeConfig();
  const { $api } = useNuxtApp();

  async function fetchUser(): Promise<IAuthUserResponse | null> {
    try {
      const data = await $api<IAuthUserResponse>(`/api/v1/users/me`);
      user.value = data;
      return user.value;
    } catch {
      clearAuth();
      return null;
    }
  }

  async function signInWithLocal(credential: IAuthorizeDto) {
    await $api(`/api/v1/auth/sign-in`, {
      method: 'POST',
      body: credential,
    });
    const userData = await fetchUser();
    if (!userData) {
      throw new Error('로그인 후 사용자 정보를 불러오지 못했습니다.');
    }
  }

  async function signInWithOAuth(provider: OAuthProvider) {
    window.location.href = `${config.public.apiBase}/api/v1/auth/oauth/${provider}`;
  }

  function clearAuth() {
    user.value = null;
  }

  async function signOut() {
    await $api(`/api/v1/auth/sign-out`, {
      method: 'POST',
    });
    clearAuth();
  }

  return {
    user,
    isAuthenticated,
    fetchUser,
    signInWithLocal,
    signInWithOAuth,
    signOut,
    clearAuth,
  };
}

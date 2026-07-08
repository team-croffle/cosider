import { useAuth } from '~/composables/use-auth';
import type { ValidMethod } from '~/types/api.type';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // 이 두 변수를 통해 Access Token 만료 시, 여러 개의 요청에 대해,
  // 처음 한 번만 토큰 갱신 요청을 보내고, 나머지 요청은 대기하다가,
  // 토큰 갱신이 완료되면 갱신된 토큰을 사용해 다시 요청을 보내도록 함

  // 현재 토큰 갱신 API가 호출되어 실행 중인지 여부
  let isRefreshing = false;
  // 갱신이 완료되길 기다리는 요청들의 callback function queue
  let refreshSubscribers: ((isSuccess: boolean) => void)[] = [];

  function onRefreshed(isSuccess: boolean): void {
    refreshSubscribers.forEach((callback) => callback(isSuccess));
    refreshSubscribers = [];
  }

  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiBase,

    async onResponseError({ request, response, options }) {
      if (response.status === 401) {
        const url = request.toString();

        // 갱신 실패 또는 로그아웃 도중 401일 시 무한루프 방지
        if (url.includes('auth/refresh') || url.includes('auth/sign-out')) {
          await nuxtApp.runWithContext(async () => {
            const { signOut } = useAuth();
            await signOut();
          });
          return Promise.reject(response);
        }

        // 만약 앞의 요청에서 401로 인해 토큰 갱신 중이면
        if (isRefreshing) {
          // Promise를 return 해 현재 API Flow를 Pause.
          return new Promise((resolve, reject) => {
            // 대기열 queue에 callback function 추가
            refreshSubscribers.push((isSuccess) => {
              if (isSuccess) {
                // Refresh 성공 시 원래 API 재요청
                resolve($fetch(request, options as typeof options & { method: ValidMethod }));
              } else {
                // 실패 시 전부 Error 처리.
                reject(response);
              }
            });
          });
        }

        // 최초 401 요청에 대해서만 실행되는 Logic.
        isRefreshing = true;

        try {
          await $fetch(`${config.public.apiBase}/api/v1/auth/refresh`, {
            method: 'POST',
          });

          isRefreshing = false;
          onRefreshed(true);

          // 현재(최초 401에 대응한) API도 다시 실행
          return $fetch(request, options as typeof options & { method: ValidMethod });
        } catch (error) {
          // 갱신 실패 시큐리티
          isRefreshing = false;
          onRefreshed(false);

          await nuxtApp.runWithContext(async () => {
            const { signOut } = useAuth();
            await signOut();
          });

          return Promise.reject(error);
        }
      }
    },
  });
  return { provide: { api } };
});

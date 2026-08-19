// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', '@nuxtjs/i18n'],

  ssr: false,

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark', // 기본값 다크모드
    fallback: 'dark',
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  routeRules: {
    '/': { prerender: true },
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ko', language: 'ko-KR', name: '한국어', file: 'ko.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'cosider-locale',
      fallbackLocale: 'en',
    },
  },

  devServer: {
    port: 5173,
  },

  compatibilityDate: '2025-01-15',

  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', 'zod'],
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },
});

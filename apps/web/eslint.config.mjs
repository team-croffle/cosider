// @ts-check
import { nuxtConfig } from '@cosider/eslint-config/nuxt';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
  {
    ignores: ['.nuxt/**', 'dist/**', 'node_modules/**', 'public/**'],
  },
  ...nuxtConfig,
]);

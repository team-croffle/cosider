import { baseConfig } from '@cosider/eslint-config/base';

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '.turbo/**', '.yarn/**'],
  },
  ...baseConfig,
];

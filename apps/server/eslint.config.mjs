// @ts-check
import { nestJsConfig } from '@cosider/eslint-config/nest';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'eslint.config.mjs',
      '**/*.cjs',
      '**/build/**',
      '**/.stversions/**', // Syncthing
      '**/coverage/**',
      '**/.vscode/**',
      '**/.git/**',
      '**/drizzle/**',
      '.yarn/**',
    ],
  },
  ...nestJsConfig,
);

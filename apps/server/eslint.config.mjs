// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import pluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

const promisePlugin = /** @type {any} */ (pluginPromise);

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
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      import: pluginImport,
      promise: promisePlugin,
      unicorn: pluginUnicorn,
    },
    rules: {
      /* Promise Rules */
      ...promisePlugin.configs.recommended.rules,
      'promise/catch-or-return': 'off',
      'promise/always-return': 'off',

      /* Team Collaboration & NestJS Rules */
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      /* Import Rules */
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      /* Unicorn Rules */
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            camelCase: true,
          },
          ignore: [
            /.*~\d{8}-\d{6}\..*$/, // Syncthing
          ],
        },
      ],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-top-level-await': 'off',
    },
  },
  eslintPluginPrettierRecommended
);

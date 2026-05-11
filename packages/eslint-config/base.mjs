import eslint from '@eslint/js';
import pluginImport from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginPromise from 'eslint-plugin-promise';
import pluginUnicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

const promisePlugin = /** @type {any} */ (pluginPromise);

export const baseConfig = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
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
  eslintPluginPrettierRecommended,
];

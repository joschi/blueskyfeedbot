import js from '@eslint/js';
import tseslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslintPlugin.configs['flat/recommended'],
  {
    languageOptions: {
      parser: tsParser,
    },
  },
  eslintConfigPrettier,
];

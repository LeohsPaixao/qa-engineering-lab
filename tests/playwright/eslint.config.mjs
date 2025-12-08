import eslintPluginTypescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import playwright from 'eslint-plugin-playwright';

/** @type {import('eslint').Linter.Config} */
export default {
  ignores: [
    'node_modules',
    'dist',
    'coverage',
    '*.config.ts'
  ],
  files: ['**/*.ts'],
  languageOptions: {
    ecmaVersion: 'latest',
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 'latest',
    },
  },
  plugins: {
    '@typescript-eslint': eslintPluginTypescript,
    playwright: playwright,
  },
  rules: {
    ...playwright.configs['recommended'].rules,
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'semi': 'error',
    'no-console': 'off',
    'no-shadow': 'off',
    'no-empty-function': 'off',
    'playwright/no-conditional-in-test': 'off',
    'playwright/no-focused-test': 'off',
    'playwright/no-only-test': 'off',
    'playwright/no-skipped-test': 'off',
  },
}
import eslintPluginTypescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import eslintPluginCypress from "eslint-plugin-cypress";

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
    cypress: eslintPluginCypress,
  },
  rules: {
    ...eslintPluginCypress.configs['recommended'].rules,
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'semi': 'error',
    'no-console': 'off',
    'no-shadow': 'off',
    'no-empty-function': 'off',
    'cypress/assertion-before-screenshot': 'warn',
    'cypress/unsafe-to-chain-command': 'off',
    'cypress/no-force': 'warn',
    'cypress/no-pause': 'error',
  }
}
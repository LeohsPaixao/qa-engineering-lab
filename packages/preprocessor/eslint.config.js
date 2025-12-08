const typescript = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-plugin-prettier');
const tsParser = require('@typescript-eslint/parser');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignores: ['eslint.config.js', 'dist', 'node_modules'],
  files: ['src/**/*.ts'],
  languageOptions: {
    parser: tsParser,
  },
  plugins: {
    '@typescript-eslint': typescript,
    prettier: prettier,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-duplicate-imports': 'error',
    'no-unused-expressions': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    'no-trailing-spaces': 'error',
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
  },
};

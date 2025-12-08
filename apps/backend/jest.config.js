const path = require('path');

/**
 * Gera uma string de timestamp a partir da data/hora atual em ISO, sem frações de segundo e com ":" substituídos por "-".
 * @returns {string} Timestamp no formato "YYYY-MM-DDTHH-MM-SS" (sem frações de segundo), derivado da representação ISO atual.
 */
function getTimestamp() {
  return new Date().toISOString().replace(/:/g, '-').split('.')[0];
}

module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  rootDir: '.',
  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
  testTimeout: 10000,
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-ctrf-json-reporter',
      {
        outputDir: path.resolve(__dirname, '../../qa-results/raw/jest', getTimestamp()),
        outputFile: 'results.json',
      },
    ],
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup-jest.ts'],
  collectCoverageFrom: ['src/modules/**/*.ts'],
  coverageDirectory: './coverage',
  transformIgnorePatterns: ['/node_modules/(?!supertest)'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
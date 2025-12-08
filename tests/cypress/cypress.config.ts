import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import codeCoverage from '@cypress/code-coverage/task';
import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import path from 'path';
import { timestamp } from '../../packages/scripts/timestamp';

dotenv.config();

export default defineConfig({
  projectId: 'en7s34',
  video: false,
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  defaultCommandTimeout: 4000,
  pageLoadTimeout: 120 * 1000,
  trashAssetsBeforeRuns: true,
  experimentalMemoryManagement: true,
  watchForFileChanges: false,
  numTestsKeptInMemory: 0,
  reporter: 'mochawesome',
  reporterOptions: {
    overwrite: false,
    html: false,
    json: true,
  },
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:8181',
    viewportHeight: 768,
    viewportWidth: 1366,
    specPattern: './tests/e2e/**/*.cy.{js,ts}',
    supportFile: './tests/e2e/support/e2e.ts',
    screenshotsFolder: './tests/misc/screenshots',
    downloadsFolder: './tests/misc/downloads',
    fixturesFolder: './tests/e2e/fixtures',
    retries: {
      experimentalStrategy: 'detect-flake-and-pass-on-threshold',
      experimentalOptions: {
        maxRetries: 1,
        passesRequired: 1,
      },
      openMode: false,
      runMode: true,
    },
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      on('file:preprocessor', createBundler())

      codeCoverage(on, config);

      config.reporterOptions.reportDir = path.resolve(__dirname, '../../qa-results/raw/cypress-e2e', timestamp());
      config.env.CYPRESS_API_URL = process.env.CYPRESS_API_URL || 'http://localhost:3001';

      return config;
    },
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        configFile: '../../apps/frontend/vite.config.ts',
      },
    },
    viewportHeight: 768,
    viewportWidth: 1366,
    specPattern: './tests/component/specs/**/*.cy.{js,ts}',
    supportFile: './tests/component/support/component.ts',
    indexHtmlFile: './tests/component/support/component-index.html',
    screenshotsFolder: './tests/misc/screenshots',
    downloadsFolder: './tests/misc/downloads',
    fixturesFolder: './tests/component/fixtures',
    retries: {
      experimentalStrategy: 'detect-flake-and-pass-on-threshold',
      experimentalOptions: {
        maxRetries: 1,
        passesRequired: 1,
      },
      openMode: false,
      runMode: true,
    },
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      on('file:preprocessor', createBundler())

      codeCoverage(on, config);

      config.reporterOptions.reportDir = path.resolve(__dirname, '../../qa-results/raw/cypress-ct', timestamp());
      return config;
    },
  },
});

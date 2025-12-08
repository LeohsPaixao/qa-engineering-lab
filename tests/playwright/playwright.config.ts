import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { timestamp } from '../../packages/scripts/timestamp';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests/specs',
  testMatch: /.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  outputDir: './tests/misc/reports',
  reporter: [
    ['list', { printSteps: true }],
    ['json', { outputFile: path.resolve(__dirname, '../../qa-results/raw/playwright-e2e', timestamp(), 'results.json') }],
  ],
  use: {
    acceptDownloads: false,
    ignoreHTTPSErrors: true,
    baseURL: process.env.PLAY_BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixels: 10,
    },
    toMatchSnapshot: {
      threshold: 0.1,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ]
});
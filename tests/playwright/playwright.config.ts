import { defineConfig, devices, ScreenshotMode, TraceMode } from '@playwright/test';
import { projectType } from './config/project.config';
import { buildReporter } from './reporters/buildReporter';

export default defineConfig({
  forbidOnly: !!process.env.CI,
  outputDir: './tests/misc/reports',
  reporter: buildReporter(projectType),
  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e/specs',
      testMatch: /.*\.e2e-spec\.ts/,
      testIgnore: [/.*\.api.spec\.ts/, /.*\.ct.spec\.ts/],
      timeout: 10000,
      fullyParallel: true,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : 3,
      use: {
        acceptDownloads: false,
        ignoreHTTPSErrors: true,
        baseURL: process.env.PLAY_BASE_URL,
        screenshot: 'only-on-failure' as ScreenshotMode,
        trace: 'on-first-retry' as TraceMode,
        ...devices['Desktop Chrome']
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
    },
    {
      name: 'api',
      testDir: './tests/api/specs',
      testMatch: /.*\.api.spec\.ts/,
      testIgnore: [/.*\.e2e-spec\.ts/, /.*\.ct.spec\.ts/],
      fullyParallel: true,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : 3,
      use: {
        baseURL: process.env.PLAY_API_URL,
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure' as ScreenshotMode,
        trace: 'on-first-retry' as TraceMode,
      },
      expect: {
        timeout: 1000,
      },
    },
    {
      name: 'component',
      testDir: './tests/component/specs',
      testMatch: /.*\.ct.spec\.ts/,
      testIgnore: [/.*\.e2e-spec\.ts/, /.*\.api.spec\.ts/],
      fullyParallel: true,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : 3,
      use: {
        baseURL: process.env.PLAY_BASE_URL,
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure' as ScreenshotMode,
        trace: 'on-first-retry' as TraceMode,
      },
    }
  ]
});
import { defineConfig, devices, ScreenshotMode, TraceMode } from '@playwright/test';
import { ctPort, frontendDir, galleryUrl, projectType } from './config/project.config';
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
      timeout: 10 * 1000,
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
        timeout: 5 * 1000,
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
        timeout: 10 * 1000,
      },
    },
    {
      name: 'component',
      testDir: './tests/component/specs',
      testMatch: /.*\.ct.spec\.ts/,
      testIgnore: [/.*\.e2e-spec\.ts/, /.*\.api.spec\.ts/],
      timeout: 15 * 1000,
      fullyParallel: true,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : 3,
      use: {
        baseURL: galleryUrl,
        ignoreHTTPSErrors: true,
        reuseContext: true,
        serviceWorkers: 'block',
        screenshot: 'only-on-failure' as ScreenshotMode,
        trace: 'on-first-retry' as TraceMode,
        ...devices['Desktop Chrome'],
      },
    }
  ],
  webServer: [
    {
      name: 'frontend-component',
      command: `npx vite --host 127.0.0.1 --port ${ctPort}`,
      cwd: frontendDir,
      url: galleryUrl,
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
      timeout: 120 * 1000,
      wait: {
        stdout: /vite v\d+\.\d+\.\d+ ready in \d+ms/,
      },
    }
  ],
});
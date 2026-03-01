import path from 'path';
import { ReporterDescription } from '@playwright/test';
import { timestamp } from '../../../packages/scripts/timestamp';

/**
 * Build the reporter configuration for Playwright.
 * @param type - The type of test to run (e2e, api, component).
 * @returns An array of reporter configurations.
 */
export const buildReporter = (type: string): ReporterDescription[] => [
  ['list', { printSteps: true }],
  ['./reporters/custom-reporter.ts'],
  ['json', {
    outputFile: path.resolve(
      __dirname,
      `../../qa-results/raw/playwright-${type}`,
      timestamp(),
      'results.json'
    )
  }]
];
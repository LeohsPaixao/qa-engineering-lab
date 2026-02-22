import type { FrameworkName } from '@/types/results.types';

interface FrameworkConfig {
  patterns: string[];
  type: 'e2e' | 'ct' | 'api' | 'unit';
  displayName: string;
}

/**
 * Configuração de frameworks
 */
export const FRAMEWORK_CONFIG: Record<FrameworkName, FrameworkConfig> = {
  'cypress-e2e': {
    patterns: ['mochawesome.json', 'mochawesome_*.json'],
    type: 'e2e',
    displayName: 'Cypress E2E',
  },
  'cypress-ct': {
    patterns: ['mochawesome.json', 'mochawesome_*.json'],
    type: 'ct',
    displayName: 'Cypress CT',
  },
  'playwright-e2e': {
    patterns: ['results.json'],
    type: 'e2e',
    displayName: 'Playwright',
  },
  'playwright-ct': {
    patterns: ['results.json'],
    type: 'ct',
    displayName: 'Playwright CT',
  },
  'robot-e2e': {
    patterns: ['output.xml'],
    type: 'e2e',
    displayName: 'Robot Framework',
  },
  'selenium-e2e': {
    patterns: ['TEST-*.xml'],
    type: 'e2e',
    displayName: 'Selenium',
  },
  'rest-assured': {
    patterns: ['TEST-*.xml'],
    type: 'api',
    displayName: 'RestAssured',
  },
  newman: {
    patterns: ['results.xml'],
    type: 'api',
    displayName: 'Newman',
  },
  jest: {
    patterns: ['results.json'],
    type: 'unit',
    displayName: 'Jest',
  },
  vitest: {
    patterns: ['results.json'],
    type: 'unit',
    displayName: 'Vitest',
  },
};

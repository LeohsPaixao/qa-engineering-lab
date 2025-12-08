export type TestStatus = 'passed' | 'failed' | 'skipped';

export interface TestResult {
  id: string;
  name: string;
  status: TestStatus;
  duration_s: number;
  file: string;
  tags: string[];
  error: string | null;
}

export interface FrameworkSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration_s: number;
}

export interface FrameworkResult {
  framework: string;
  timestamp: string;
  type: string;
  summary: FrameworkSummary;
  tests: TestResult[];
}

export interface OverallSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration_s: number;
}

export interface ByFramework {
  [key: string]: FrameworkSummary;
}

export interface SummaryData {
  timestamp: string;
  generatedAt: string;
  overall: OverallSummary;
  byFramework: ByFramework;
  artifacts: {
    processedFiles: string[];
    rawFiles: string[];
  };
}

export type FrameworkName = 'cypress-ct' | 'cypress-e2e' | 'jest' | 'playwright-e2e' | 'robot-e2e' | 'selenium-e2e' | 'vitest';

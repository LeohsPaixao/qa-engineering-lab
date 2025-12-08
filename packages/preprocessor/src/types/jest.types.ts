/**
 * Estrutura completa do JSON de resultados do Jest
 */
export interface JestData {
  results: JestResults;
}

/**
 * Resultados do Jest
 */
export interface JestResults {
  tool: JestTool;
  summary: JestSummary;
  tests: JestTest[];
}

/**
 * Ferramenta do Jest
 */
export interface JestTool {
  name: string;
}

/**
 * Resumo dos resultados do Jest
 */
export interface JestSummary {
  tests: number;
  passed: number;
  failed: number;
  pending: number;
  skipped: number;
  other: number;
  start: number;
  stop: number;
}

/**
 * Resultado de um teste individual do Jest
 */
export interface JestTest {
  name: string;
  duration: number;
  status: 'passed' | 'failed' | 'pending' | 'skipped' | 'todo' | 'unknown';
  message?: JestErrorMessage;
  trace?: string;
  rawStatus: 'passed' | 'failed' | 'pending' | 'skipped' | 'todo' | 'unknown';
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security' | 'other';
  filePath: string;
  retries: number;
  flaky: boolean;
  suite: string;
}

export interface JestErrorMessage {
  message?: string;
}

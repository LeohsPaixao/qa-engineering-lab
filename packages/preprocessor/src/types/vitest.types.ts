/**
 * Estrutura completa do JSON de resultados do Vitest
 */
export interface VitestData {
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numPendingTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  numPendingTests: number;
  numTodoTests: number;
  snapshot: VitestSnapshot;
  startTime: number;
  success: boolean;
  testResults: VitestTestResult[];
  coverage?: VitestCoverage;
}

/**
 * Informações de snapshot do Vitest
 */
export interface VitestSnapshot {
  added: number;
  failure: boolean;
  filesAdded: number;
  filesRemoved: number;
  filesRemovedList: string[];
  filesUnmatched: number;
  filesUpdated: number;
  matched: number;
  total: number;
  unchecked: number;
  uncheckedKeysByFile: unknown[];
  unmatched: number;
  updated: number;
  didUpdate: boolean;
}

/**
 * Resultado de um arquivo de teste do Vitest
 */
export interface VitestTestResult {
  assertionResults: VitestAssertionResult[];
  startTime: number;
  endTime: number;
  status: 'passed' | 'failed' | 'pending' | 'skipped';
  message: string;
  name: string; // Caminho completo do arquivo
}

/**
 * Resultado de uma asserção/teste individual do Vitest
 */
export interface VitestAssertionResult {
  ancestorTitles: string[];
  fullName: string;
  status: 'passed' | 'failed' | 'pending' | 'skipped' | 'todo';
  title: string;
  duration: number; // em milissegundos
  failureMessages: VitestError[];
  meta: Record<string, unknown>;
}

export interface VitestError {
  message: string;
}

/**
 * Informações de cobertura de código (opcional)
 */
export interface VitestCoverage {
  [key: string]: unknown;
}

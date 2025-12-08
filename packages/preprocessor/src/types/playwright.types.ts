/**
 * Estrutura completa do JSON de resultados do Playwright
 */
export interface PlaywrightData {
  config: PlaywrightConfig;
  suites: PlaywrightSuite[];
  errors: unknown[];
  stats: PlaywrightStats;
}

/**
 * Estatísticas do Playwright
 */
export interface PlaywrightStats {
  startTime: string;
  duration: number;
  expected: number;
  skipped: number;
  unexpected: number;
  flaky: number;
}

/**
 * Configuração do Playwright (parcial, apenas campos relevantes)
 */
export interface PlaywrightConfig {
  configFile?: string;
  rootDir?: string;
  version?: string;
  metadata?: {
    actualWorkers?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Suite do Playwright (estrutura recursiva)
 */
export interface PlaywrightSuite {
  title: string;
  file: string;
  column: number;
  line: number;
  specs: PlaywrightSpec[];
  suites: PlaywrightSuite[];
}

/**
 * Spec (teste) do Playwright
 */
export interface PlaywrightSpec {
  title: string;
  ok: boolean;
  tags: string[];
  tests: PlaywrightTest[];
  id: string;
  file: string;
  line: number;
  column: number;
}

/**
 * Teste individual do Playwright
 */
export interface PlaywrightTest {
  timeout: number;
  annotations: PlaywrightAnnotation[];
  expectedStatus: string;
  projectId: string;
  projectName: string;
  results: PlaywrightTestResult[];
  status: 'expected' | 'unexpected' | 'skipped' | 'flaky';
}

/**
 * Anotação do Playwright
 */
export interface PlaywrightAnnotation {
  type: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Resultado de execução de um teste do Playwright
 */
export interface PlaywrightTestResult {
  workerIndex: number;
  status: PlaywrightTestResultStatus;
  duration: number;
  errors: PlaywrightError[];
  stdout: unknown[];
  stderr: unknown[];
  retry: number;
  startTime: string;
  attachments: PlaywrightAttachment[];
  error?: PlaywrightError;
}

export type PlaywrightTestResultStatus = 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted' | 'unknown';

/**
 * Erro do Playwright
 */
export interface PlaywrightError {
  message?: string;
  stack?: string;
  location?: {
    file: string;
    line: number;
    column: number;
  };
  [key: string]: unknown;
}

/**
 * Anexo do Playwright (screenshots, etc)
 */
export interface PlaywrightAttachment {
  name: string;
  contentType: string;
  path: string;
  [key: string]: unknown;
}

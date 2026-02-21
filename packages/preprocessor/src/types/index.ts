export interface PreprocessorConfig {
  rawDir: string;
  processedDir: string;
  logLevel: 'silent' | 'normal' | 'verbose';
}

/**
 * Framework suportado pelo preprocessor
 */
export type Framework =
  | 'cypress-e2e'
  | 'cypress-ct'
  | 'playwright-e2e'
  | 'playwright-ct'
  | 'jest'
  | 'vitest'
  | 'robot-e2e'
  | 'selenium-e2e'
  | 'rest-assured'
  | 'newman';

/**
 * Status de um teste
 */
export type TestStatus = 'passed' | 'failed' | 'skipped';

/**
 * Tipo de teste
 */
export type TestType = 'ct' | 'e2e' | 'unit' | 'api' | 'unknown';

/**
 * Configuração de um framework
 */
export type FrameworkConfig = {
  patterns: string[];
  type: TestType;
};

/**
 * Informações sobre um arquivo raw encontrado
 */
export interface RawFile {
  path: string;
  framework: Framework;
  timestamp: string;
  baseDir: string;
  type: TestType;
}

/**
 * Resumo de estatísticas de testes
 */
export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration_s: number;
}

/**
 * Resultado de um teste individual
 */
export interface TestResult {
  id: string;
  name: string;
  status: TestStatus;
  duration_s: number;
  file: string;
  tags?: string[];
  error?: string | null;
}

/**
 * Metadados opcionais do framework
 */
export interface FrameworkMetadata {
  node?: string;
  os?: string;
  [key: string]: unknown;
}

/**
 * Dados normalizados de um framework específico
 * Formato de saída: {framework}.json
 */
export interface NormalizedFrameworkData {
  framework: Framework;
  timestamp: string;
  type: TestType;
  summary: TestSummary;
  tests: TestResult[];
  metadata?: FrameworkMetadata;
}

/**
 * Resumo agregado de todos os frameworks
 * Formato de saída: summary.json
 */
export interface SummaryData {
  timestamp: string;
  generatedAt: string;
  overall: TestSummary;
  byFramework: Record<Framework, TestSummary>;
  artifacts: {
    processedFiles: string[];
    rawFiles: string[];
  };
}

/**
 * Dados brutos após parsing (antes da normalização)
 * Estrutura pode variar conforme o framework
 */
export interface ParsedData {
  framework: Framework;
  timestamp: string;
  type: TestType;
  raw: unknown;
  tests: unknown[];
  metadata?: FrameworkMetadata;
}

/**
 * Interface para Loaders
 * Responsável por carregar arquivos raw (JSON ou XML)
 */
export interface Loader {
  load(file: RawFile): Promise<unknown>;
  canLoad(file: RawFile): boolean;
}

/**
 * Interface para Parsers
 * Responsável por fazer o parsing dos dados carregados
 */
export interface Parser {
  parse(content: unknown, file: RawFile): ParsedData | Promise<ParsedData>;
  canParse(file: RawFile): boolean;
}

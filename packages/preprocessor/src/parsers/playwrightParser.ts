import path from 'path';
import { FrameworkMetadata, ParsedData, Parser, RawFile } from '../types';
import {
  PlaywrightData,
  PlaywrightError,
  PlaywrightSpec,
  PlaywrightSuite,
  PlaywrightTest,
  PlaywrightTestResult,
  PlaywrightTestResultStatus,
} from '../types/playwright.types';

const ANSI_ESCAPE_REGEX = new RegExp('\\u001B\\[[0-9;]*m', 'g');

/**
 * Converte duração de milissegundos para segundos
 * @param ms - Duração em milissegundos
 * @returns Duração em segundos
 */
function msToSeconds(ms: number): number {
  return ms / 1000;
}

/**
 * Converte o status do Playwright para o status padronizado
 * @param status - Status do Playwright
 * @returns Status padronizado
 */
function mapStatusToStandard(status: PlaywrightTestResultStatus): PlaywrightTestResultStatus {
  if (status === 'passed') {
    return 'passed';
  }
  if (status === 'failed' || status === 'timedOut') {
    return 'failed';
  }
  if (status === 'interrupted') {
    return 'interrupted';
  }
  if (status === 'skipped') {
    return 'skipped';
  }
  return 'unknown';
}

/**
 * Extrai e limpa mensagem de erro do objeto error do Playwright
 * Remove códigos ANSI das mensagens
 * @param error - Erro do Playwright
 * @returns Mensagem de erro limpa ou null se não houver erro
 */
function extractErrorMessage(error: PlaywrightError | undefined): string | null {
  if (!error) {
    return null;
  }

  if (error.message) {
    return error.message.replace(ANSI_ESCAPE_REGEX, '');
  }
  if (error.stack) {
    const firstLine = error.stack.split('\n')[0];
    return firstLine.replace(ANSI_ESCAPE_REGEX, '') || null;
  }
  return null;
}

/**
 * Extrai o erro principal de um array de erros
 * @param errors - Array de erros do Playwright
 * @returns Mensagem de erro limpa ou null se não houver erro
 */
function extractMainError(errors: PlaywrightError[]): string | null {
  if (errors.length === 0) {
    return null;
  }
  for (const error of errors) {
    const message = extractErrorMessage(error);
    if (message) {
      return message;
    }
  }
  return null;
}

/**
 * Gera ID único para o teste
 * Formato: fileName:specTitle
 * @param spec - Spec do Playwright
 * @param filePath - Caminho do arquivo
 * @returns ID único para o teste
 */
function generateTestId(spec: PlaywrightSpec, filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  const specTitle = spec.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  return `${fileName}:${specTitle}`;
}

/**
 * Obtém o resultado final de um teste (último resultado)
 * @param test - Teste do Playwright
 * @returns Resultado final do teste ou null se não houver resultados
 */
function getFinalResult(test: PlaywrightTest): PlaywrightTestResult | null {
  if (test.results.length === 0) {
    return null;
  }
  return test.results[test.results.length - 1];
}

/**
 * Extrai todos os specs de todas as suites
 * @param suites - Suites do Playwright
 * @returns Array de objetos com spec e caminho do arquivo
 */
function extractAllSpecs(suites: PlaywrightSuite[]): Array<{ spec: PlaywrightSpec; file: string }> {
  const allSpecs: Array<{ spec: PlaywrightSpec; file: string }> = [];
  for (const suite of suites) {
    for (const nestedSuite of suite.suites) {
      for (const spec of nestedSuite.specs) {
        allSpecs.push({ spec, file: nestedSuite.file });
      }
    }
    for (const spec of suite.specs) {
      allSpecs.push({ spec, file: suite.file });
    }
  }
  return allSpecs;
}

/**
 * Extrai metadados do Playwright se disponível
 * @param data - Dados do Playwright
 * @returns Metadados do Playwright ou undefined
 */
function extractMetadata(data: PlaywrightData): FrameworkMetadata | undefined {
  const metadata: FrameworkMetadata = {};

  if (data.config?.version) {
    metadata.playwright = data.config.version;
  }

  if (data.config?.metadata?.actualWorkers) {
    metadata.workers = data.config.metadata.actualWorkers as number;
  }

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

/**
 * Parser para resultados do Playwright (results.json)
 */
export const playwrightParser: Parser = {
  canParse: (file: RawFile): boolean => {
    return file.framework === 'playwright-e2e' || file.framework === 'playwright-ct';
  },
  parse: (content: unknown, file: RawFile): ParsedData => {
    if (!content || typeof content !== 'object') {
      throw new Error('Invalid playwright data: content is not an object');
    }

    const data = content as PlaywrightData;

    if (!data.stats || !data.suites) {
      throw new Error('Invalid playwright data: missing stats or suites');
    }

    const allSpecs = extractAllSpecs(data.suites);
    const parsedTests: unknown[] = [];

    for (const { spec, file: filePath } of allSpecs) {
      for (const test of spec.tests) {
        const finalResult = getFinalResult(test);

        if (!finalResult) {
          continue;
        }

        let error: string | null = null;
        if (finalResult.error) {
          error = extractErrorMessage(finalResult.error);
        } else if (finalResult.errors && finalResult.errors.length > 0) {
          error = extractMainError(finalResult.errors);
        }

        parsedTests.push({
          id: generateTestId(spec, filePath),
          name: spec.title,
          status: mapStatusToStandard(finalResult.status),
          duration_s: msToSeconds(finalResult.duration),
          file: path.basename(filePath),
          tags: spec.tags || [],
          error,
        });
      }
    }

    return {
      framework: file.framework,
      timestamp: file.timestamp,
      type: file.type,
      raw: data,
      tests: parsedTests,
      metadata: extractMetadata(data),
    };
  },
};

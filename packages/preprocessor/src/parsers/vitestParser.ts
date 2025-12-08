import path from 'path';
import { FrameworkMetadata, ParsedData, Parser, RawFile } from '../types';
import { VitestAssertionResult, VitestData, VitestError, VitestTestResult } from '../types/vitest.types';

const ANSI_ESCAPE_REGEX = new RegExp('\\u001B\\[[0-9;]*m', 'g');

/**
 * Converte duração de milissegundos para segundos
 * @param ms - Duração em milissegundos
 * @returns Duração em segundos (retorna 0 se inválido)
 */
function msToSeconds(ms: number | undefined | null): number {
  if (ms === undefined || ms === null || isNaN(ms)) {
    return 0;
  }
  return ms / 1000;
}

/**
 * Converte status do Vitest para status padronizado
 * @param status - Status do Vitest
 * @returns Status padronizado
 */
function mapStatusToStandard(
  status: 'passed' | 'failed' | 'pending' | 'skipped' | 'todo',
): 'passed' | 'failed' | 'skipped' | 'pending' | 'todo' | 'unknown' {
  if (status === 'passed') {
    return 'passed';
  }
  if (status === 'failed') {
    return 'failed';
  }
  if (status === 'pending') {
    return 'pending';
  }
  if (status === 'skipped') {
    return 'skipped';
  }
  if (status === 'todo') {
    return 'todo';
  }
  return 'unknown';
}

/**
 * Extrai e limpa mensagem de erro do array de failureMessages do Vitest
 * Remove códigos ANSI das mensagens
 * @param failureMessages - Array de failureMessages do Vitest (strings ou objetos)
 * @returns Mensagem de erro limpa ou null se não houver erro
 */
function extractErrorMessage(failureMessages: VitestError[] | string[] | undefined): string | null {
  if (!failureMessages || failureMessages.length === 0) {
    return null;
  }

  const firstItem = failureMessages[0];

  if (typeof firstItem === 'string') {
    return firstItem.replace(ANSI_ESCAPE_REGEX, '');
  }

  if (firstItem && typeof firstItem === 'object' && 'message' in firstItem) {
    const error = firstItem as VitestError;
    if (error.message) {
      return error.message.replace(ANSI_ESCAPE_REGEX, '');
    }
  }

  return null;
}

/**
 * Gera ID único para o teste
 * Formato: fileName:specTitle
 * @param assertionResult - Resultado da assertion do Vitest
 * @param filePath - Caminho do arquivo
 * @returns ID único para o teste
 */
function generateTestId(assertionResult: VitestAssertionResult, filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  const specTitle = assertionResult.fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  return `${fileName}:${specTitle}`;
}

/**
 * Extrai todos os assertionResults de todos os testResults
 * @param testResults - Array de testResults do Vitest
 * @returns Array de objetos com assertionResult e nome do arquivo
 */
function extractAllSpecs(testResults: VitestTestResult[]): Array<{ assertionResult: VitestAssertionResult; file: string }> {
  const allSpecs: Array<{ assertionResult: VitestAssertionResult; file: string }> = [];
  for (const testResult of testResults) {
    const fileName = path.basename(testResult.name);
    for (const assertionResult of testResult.assertionResults) {
      allSpecs.push({ assertionResult, file: fileName });
    }
  }

  return allSpecs;
}

/**
 * Extrai metadados do Vitest se disponível
 * @param data - Dados do Vitest
 * @returns Metadados do Vitest ou undefined
 */
function extractMetadata(data: VitestData): FrameworkMetadata | undefined {
  const metadata: FrameworkMetadata = {};

  if (data.startTime) {
    metadata.startTime = data.startTime;
  }

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

/**
 * Parser para resultados do Vitest (results.json)
 */
export const vitestParser: Parser = {
  canParse: (file: RawFile): boolean => {
    return file.framework === 'vitest';
  },
  parse: (content: unknown, file: RawFile): ParsedData => {
    if (!content || typeof content !== 'object') {
      throw new Error('Invalid vitest data: content is not an object');
    }
    const data = content as VitestData;

    const allSpecs = extractAllSpecs(data.testResults);
    const parsedTests: unknown[] = [];

    for (const { assertionResult, file: filePath } of allSpecs) {
      parsedTests.push({
        id: generateTestId(assertionResult, filePath),
        name: assertionResult.fullName,
        status: mapStatusToStandard(assertionResult.status),
        duration_s: msToSeconds(assertionResult.duration),
        file: filePath,
        error: extractErrorMessage(assertionResult.failureMessages),
      });
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

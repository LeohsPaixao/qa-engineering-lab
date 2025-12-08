import path from 'path';
import { FrameworkMetadata, ParsedData, Parser, RawFile } from '../types';
import { JestData, JestErrorMessage, JestTest } from '../types/jest.types';

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
 * Converte status do Jest para status padronizado
 * @param status - Status do teste
 * @returns Status padronizado
 */
function mapStatusToStandard(
  status: 'passed' | 'failed' | 'pending' | 'skipped' | 'todo' | 'unknown',
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
 * Extrai e limpa mensagem de erro do Jest
 * Remove códigos ANSI das mensagens
 * @param message - Mensagem de erro do Jest
 * @returns Mensagem de erro limpa ou null se não houver erro
 */
function extractErrorMessage(message: JestErrorMessage | undefined): string | null {
  return message?.message?.replace(/\u001b\[[0-9;]*m/g, '') || null;
}

/**
 * Gera ID único para o teste
 * Formato: fileName:testName
 * @param test - Teste do Jest
 * @param filePath - Caminho do arquivo
 * @returns ID único para o teste
 */
function generateTestId(test: JestTest, filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  const specTitle = test.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  return `${fileName}:${specTitle}`;
}

/**
 * Extrai todos os testes do Jest com informações do arquivo
 * @param tests - Array de testes do Jest
 * @returns Array de objetos com teste e nome do arquivo
 */
function extractAllTests(tests: JestTest[]): Array<{ test: JestTest; file: string }> {
  const allTests: Array<{ test: JestTest; file: string }> = [];
  for (const test of tests) {
    const fileName = path.basename(test.filePath);
    allTests.push({ test, file: fileName });
  }

  return allTests;
}

/**
 * Extrai metadados do Jest se disponível
 * @param data - Dados do Jest
 * @returns Metadados do Jest ou undefined
 */
function extractMetadata(data: JestData): FrameworkMetadata | undefined {
  const metadata: FrameworkMetadata = {};

  if (data.results?.tool?.name) {
    metadata.tool = data.results.tool.name;
  }

  if (data.results?.summary?.start) {
    metadata.startTime = data.results.summary.start;
  }

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

/**
 * Parser para resultados do Jest (results.json)
 */
export const jestParser: Parser = {
  canParse: (file: RawFile): boolean => {
    return file.framework === 'jest';
  },
  parse: (content: unknown, file: RawFile): ParsedData => {
    if (!content || typeof content !== 'object') {
      throw new Error('Invalid jest data: content is not an object');
    }

    const data = content as JestData;

    const allTests = extractAllTests(data.results.tests);
    const parsedTests: unknown[] = [];

    for (const { test, file: filePath } of allTests) {
      parsedTests.push({
        id: generateTestId(test, filePath),
        name: test.name,
        status: mapStatusToStandard(test.status),
        duration_s: msToSeconds(test.duration),
        file: filePath,
        tags: [],
        error: extractErrorMessage(test.message),
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

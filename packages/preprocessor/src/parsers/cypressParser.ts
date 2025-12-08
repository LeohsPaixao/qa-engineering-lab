import path from 'path';
import { FrameworkMetadata, ParsedData, Parser, RawFile } from '../types';
import { MochawesomeData, MochawesomeResult, MochawesomeStats, MochawesomeSuite, MochawesomeTest } from '../types/mochawesome.types';

/**
 * Faz merge de múltiplos arquivos mochawesome
 * @param files - Array de objetos MochawesomeData
 * @returns Objeto MochawesomeData com os dados mesclados
 * @throws Error se não houver arquivos para mesclar
 */
function mergeMochawesomeFiles(files: MochawesomeData[]): MochawesomeData {
  if (files.length === 0) {
    throw new Error('No mochawesome files to merge');
  }

  if (files.length === 1) {
    return files[0];
  }

  const merged = { ...files[0] };

  const mergedStats: MochawesomeStats = {
    suites: 0,
    tests: 0,
    passes: 0,
    pending: 0,
    failures: 0,
    start: files[0].stats.start,
    end: files[files.length - 1].stats.end,
    duration: 0,
    testsRegistered: 0,
    passPercent: 0,
    pendingPercent: 0,
    other: 0,
    hasOther: false,
    skipped: 0,
    hasSkipped: false,
  };

  for (const file of files) {
    mergedStats.suites += file.stats.suites;
    mergedStats.tests += file.stats.tests;
    mergedStats.passes += file.stats.passes;
    mergedStats.pending += file.stats.pending;
    mergedStats.failures += file.stats.failures;
    mergedStats.duration += file.stats.duration;
    mergedStats.testsRegistered += file.stats.testsRegistered;
    mergedStats.other += file.stats.other;
    mergedStats.skipped += file.stats.skipped;

    if (file.stats.hasOther) {
      mergedStats.hasOther = true;
    }
    if (file.stats.hasSkipped) {
      mergedStats.hasSkipped = true;
    }
  }

  if (mergedStats.testsRegistered > 0) {
    mergedStats.passPercent = (mergedStats.passes / mergedStats.testsRegistered) * 100;
    mergedStats.pendingPercent = (mergedStats.pending / mergedStats.testsRegistered) * 100;
  }

  merged.stats = mergedStats;

  merged.results = files.flatMap((file) => file.results);

  merged.meta = files[0].meta;

  return merged;
}

/**
 * Converte duração de milissegundos para segundos
 * @param ms - Duração em milissegundos
 * @returns Duração em segundos
 */
function msToSeconds(ms: number): number {
  return ms / 1000;
}

/**
 * Converte o estado do mochawesome para o status padronizado
 * @param state - Estado do teste
 * @param skipped - Indica se o teste foi ignorado
 * @param pending - Indica se o teste está pendente
 * @returns Status padronizado
 */
function mapStateToStatus(state: string, skipped: boolean, pending: boolean): 'passed' | 'failed' | 'skipped' {
  if (skipped) {
    return 'skipped';
  }
  if (pending || state === 'pending') {
    return 'skipped';
  }
  if (state === 'failed') {
    return 'failed';
  }
  return 'passed';
}

/**
 * Extrai mensagem de erro do objeto err do mochawesome
 * @param err - Objeto err do mochawesome
 * @returns Mensagem de erro ou null se não houver erro
 */
function extractErrorMessage(err: { message?: string; estack?: string } | {}): string | null {
  if (!err || typeof err !== 'object') {
    return null;
  }

  const errorObj = err as { message?: string; estack?: string };
  if (errorObj.message) {
    return errorObj.message;
  }
  if (errorObj.estack) {
    const firstLine = errorObj.estack.split('\n')[0];
    return firstLine || null;
  }
  return null;
}

/**
 * Gera ID único para o teste
 * Formato: fileName:testName (ex: login.cy.ts:login)
 * @param test - Teste do mochawesome
 * @param filePath - Caminho do arquivo
 * @returns ID único para o teste
 */
function generateTestId(test: MochawesomeTest, filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  const testName = test.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${fileName}:${testName}`;
}

/**
 * Extrai todos os testes de uma suite recursivamente com informações do arquivo
 * @param suite - Suite do mochawesome
 * @param baseFile - Caminho do arquivo base
 * @returns Array de objetos com teste e caminho do arquivo
 */
function extractTestsFromSuite(suite: MochawesomeSuite, baseFile: string): Array<{ test: MochawesomeTest; file: string }> {
  const tests: Array<{ test: MochawesomeTest; file: string }> = [];

  const suiteFile = suite.fullFile || suite.file || baseFile;

  for (const test of suite.tests) {
    tests.push({ test, file: suiteFile });
  }

  for (const nestedSuite of suite.suites) {
    tests.push(...extractTestsFromSuite(nestedSuite, suiteFile));
  }

  return tests;
}

/**
 * Extrai todos os testes dos results com informações do arquivo
 * @param results - Array de objetos MochawesomeResult
 * @returns Array de objetos com teste e caminho do arquivo
 */
function extractAllTests(results: MochawesomeResult[]): Array<{ test: MochawesomeTest; file: string }> {
  const allTests: Array<{ test: MochawesomeTest; file: string }> = [];

  for (const result of results) {
    const baseFile = result.fullFile || result.file || 'unknown';

    for (const suite of result.suites) {
      allTests.push(...extractTestsFromSuite(suite, baseFile));
    }
  }

  return allTests;
}

/**
 * Extrai metadados do mochawesome se disponível
 * @param data - Dados do mochawesome
 * @returns Metadados do mochawesome ou undefined
 */
function extractMetadata(data: MochawesomeData): FrameworkMetadata | undefined {
  const metadata: FrameworkMetadata = {};

  if (data.meta) {
    if (Object.keys(data.meta).length > 0) {
      metadata.mochawesomeVersion = data.meta.mochawesome?.version as string | undefined;
      metadata.mochawesomeOptions = data.meta.mochawesome?.options as unknown | undefined;
      metadata.margeOptions = data.meta.marge?.options as unknown | undefined;
    }
  }
  return metadata;
}

/**
 * Converte strings JSON para objetos MochawesomeData
 * @param jsonStrings - Array de strings JSON
 * @returns Array de objetos MochawesomeData
 * @throws Error se algum JSON for inválido
 */
function parseJsonFiles(jsonStrings: string[]): MochawesomeData[] {
  const parsedFiles: MochawesomeData[] = [];

  for (const jsonString of jsonStrings) {
    try {
      const parsed = JSON.parse(jsonString) as MochawesomeData;
      parsedFiles.push(parsed);
    } catch (error) {
      console.error('Error parsing mochawesome JSON:', error);
      throw new Error(`Error parsing mochawesome JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return parsedFiles;
}

/**
 * Parser para resultados do Cypress (mochawesome.json)
 */
export const cypressParser: Parser = {
  canParse(file: RawFile): boolean {
    return file.framework === 'cypress-e2e' || file.framework === 'cypress-ct';
  },

  parse(content: unknown, file: RawFile): ParsedData {
    if (!Array.isArray(content)) {
      throw new Error('Invalid mochawesome data: content is not an array of JSON strings');
    }

    if (content.length === 0) {
      throw new Error('Invalid mochawesome data: no JSON files provided');
    }

    if (!content.every((item) => typeof item === 'string')) {
      throw new Error('Invalid mochawesome data: content array contains non-string items');
    }

    const parsedFiles = parseJsonFiles(content as string[]);
    const data = mergeMochawesomeFiles(parsedFiles);
    const allTests = extractAllTests(data.results);

    const parsedTests = allTests.map(({ test, file: filePath }) => {
      return {
        id: generateTestId(test, filePath),
        name: test.title,
        status: mapStateToStatus(test.state, test.skipped, test.pending),
        duration_s: msToSeconds(test.duration),
        file: path.basename(filePath),
        tags: [],
        error: extractErrorMessage(test.err),
      };
    });

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

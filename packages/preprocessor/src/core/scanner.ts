import fs from 'fs-extra';
import path from 'path';
import { Framework, RawFile } from '../types';

/**
 * Padrões de arquivos para cada framework
 */
const FRAMEWORK_FILE_PATTERNS: Record<Framework, string[]> = {
  'cypress-e2e': ['mochawesome.json', 'mochawesome_*.json'],
  'cypress-ct': ['mochawesome.json', 'mochawesome_*.json'],
  'playwright-e2e': ['results.json'],
  'playwright-ct': ['results.json'],
  'robot-e2e': ['output.xml'],
  'selenium-e2e': ['TEST-*.xml'],
  'rest-assured': ['TEST-*.xml'],
  jest: ['results.json'],
  vitest: ['results.json'],
};

/**
 * Detecta o tipo de teste a partir do nome do framework
 */
function detectTypeTest(filePath: string): { type: 'ct' | 'e2e' | 'unit' | 'api' | 'unknown' } {
  if (filePath.includes('cypress-ct') || filePath.includes('playwright-ct')) {
    return { type: 'ct' };
  }
  if (filePath.includes('cypress-e2e') || filePath.includes('playwright-e2e')) {
    return { type: 'e2e' };
  }
  if (filePath.includes('vitest') || filePath.includes('jest')) {
    return { type: 'unit' };
  }
  if (filePath.includes('robot-e2e') || filePath.includes('selenium-e2e')) {
    return { type: 'e2e' };
  }
  if (filePath.includes('rest-assured')) {
    return { type: 'api' };
  }

  return { type: 'unknown' };
}

/**
 * Verifica se uma string é um timestamp válido
 * Formato esperado: 2025-11-20T15-41-24 ou 2025-11-20-21-39-05
 */
function isValidTimestamp(timestamp: string): boolean {
  const timestampRegex = /^\d{4}-\d{2}-\d{2}[T-]\d{2}-\d{2}-\d{2}$/;
  return timestampRegex.test(timestamp);
}

/**
 * Extrai o framework do caminho do diretório
 */
function extractFramework(dirName: string): Framework | null {
  const frameworks: Framework[] = [
    'cypress-e2e',
    'cypress-ct',
    'playwright-e2e',
    'playwright-ct',
    'jest',
    'vitest',
    'robot-e2e',
    'selenium-e2e',
    'rest-assured',
  ];

  return frameworks.includes(dirName as Framework) ? (dirName as Framework) : null;
}

/**
 * Verifica se um arquivo corresponde a um padrão
 */
function matchesPattern(fileName: string, pattern: string): boolean {
  const regexPattern = pattern.replace(/\*/g, '.*').replace(/\?/g, '.');
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(fileName);
}

/**
 * Encontra arquivos de resultado em um diretório de timestamp
 */
async function findResultFiles(timestampDir: string, framework: Framework): Promise<string[]> {
  const patterns = FRAMEWORK_FILE_PATTERNS[framework];
  const foundFiles: string[] = [];

  const entries = await fs.readdir(timestampDir, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile());

  for (const file of files) {
    for (const pattern of patterns) {
      if (matchesPattern(file.name, pattern)) {
        foundFiles.push(path.join(timestampDir, file.name));
        break;
      }
    }
  }

  return foundFiles;
}

/**
 * Normaliza um timestamp para formato comparável
 * Formato esperado: 2025-11-20-21-39-05
 */
function normalizeTimestamp(timestamp: string): string {
  if (timestamp.includes('T')) {
    return timestamp;
  }
  return timestamp.replace(/-(\d{2})-(\d{2})-(\d{2})$/, 'T$1-$2-$3');
}
/**
 * Compara dois timestamps para ordenação (mais recente primeiro)
 */
function compareTimestamps(a: string, b: string): number {
  const normalizedA = normalizeTimestamp(a);
  const normalizedB = normalizeTimestamp(b);
  return normalizedB.localeCompare(normalizedA);
}

/**
 * Escaneia o diretório raw para encontrar arquivos de resultados de testes
 * @param rawDir - o diretório raw para escanear
 * @returns uma promise que resolve para um array de RawFile
 */
export async function scanRawDirectory(rawDir: string): Promise<RawFile[]> {
  const rawFilesByFramework = new Map<Framework, RawFile>();

  if (!(await fs.pathExists(rawDir))) {
    return [];
  }

  const entries = await fs.readdir(rawDir, { withFileTypes: true });
  const frameworkDirs = entries.filter((entry) => entry.isDirectory());

  for (const frameworkDir of frameworkDirs) {
    const framework = extractFramework(frameworkDir.name);

    if (!framework) {
      continue;
    }

    const frameworkPath = path.join(rawDir, frameworkDir.name);
    const timestampEntries = await fs.readdir(frameworkPath, { withFileTypes: true });

    const timestampDirs = timestampEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((timestamp) => isValidTimestamp(timestamp))
      .sort(compareTimestamps);

    if (timestampDirs.length === 0) {
      continue;
    }

    const latestTimestamp = timestampDirs[0];
    const timestampPath = path.join(frameworkPath, latestTimestamp);
    const resultFiles = await findResultFiles(timestampPath, framework);

    if (resultFiles.length === 0) {
      continue;
    }

    const baseDir = timestampPath;
    let mainFile = resultFiles[0];

    if (framework === 'cypress-e2e' || framework === 'cypress-ct') {
      const mainMochawesome = resultFiles.find((f) => path.basename(f) === 'mochawesome.json');
      if (mainMochawesome) {
        mainFile = mainMochawesome;
      }
    }

    const testType = detectTypeTest(mainFile);

    rawFilesByFramework.set(framework, {
      path: mainFile,
      framework,
      timestamp: latestTimestamp,
      baseDir,
      type: testType.type,
    });
  }

  return Array.from(rawFilesByFramework.values());
}

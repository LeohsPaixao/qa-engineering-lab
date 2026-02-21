import fs from 'fs-extra';
import path from 'path';
import { Framework, FrameworkConfig, RawFile } from '../types';

/**
 * Configuração de frameworks
 */
const FRAMEWORK_CONFIG: Record<Framework, FrameworkConfig> = {
  'cypress-e2e': {
    patterns: ['mochawesome.json', 'mochawesome_*.json'],
    type: 'e2e',
  },
  'cypress-ct': {
    patterns: ['mochawesome.json', 'mochawesome_*.json'],
    type: 'ct',
  },
  'playwright-e2e': {
    patterns: ['results.json'],
    type: 'e2e',
  },
  'playwright-ct': {
    patterns: ['results.json'],
    type: 'ct',
  },
  'robot-e2e': {
    patterns: ['output.xml'],
    type: 'e2e',
  },
  'newman': {
    patterns: ['results.xml'],
    type: 'api',
  },
  'selenium-e2e': {
    patterns: ['TEST-*.xml'],
    type: 'e2e',
  },
  'rest-assured': {
    patterns: ['TEST-*.xml'],
    type: 'api',
  },
  jest: {
    patterns: ['results.json'],
    type: 'unit',
  },
  vitest: {
    patterns: ['results.json'],
    type: 'unit',
  },
};

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
  return dirName in FRAMEWORK_CONFIG
    ? (dirName as Framework)
    : null;
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
  const patterns = FRAMEWORK_CONFIG[framework].patterns;
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

    const testType = FRAMEWORK_CONFIG[framework].type;

    rawFilesByFramework.set(framework, {
      path: mainFile,
      framework,
      timestamp: latestTimestamp,
      baseDir,
      type: testType,
    });
  }

  return Array.from(rawFilesByFramework.values());
}

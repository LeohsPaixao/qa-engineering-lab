import fs from 'fs-extra';
import path from 'path';
import { Loader, RawFile } from '../types';

/**
 * Encontra todos os arquivos JSON mochawesome no diretório
 * @param baseDir - Diretório base para buscar os arquivos
 * @returns Array de strings com os caminhos dos arquivos encontrados
 */
async function findMochawesomeFiles(baseDir: string): Promise<string[]> {
  const files: string[] = [];

  const mainFile = path.join(baseDir, 'mochawesome.json');
  if (await fs.pathExists(mainFile)) {
    files.push(mainFile);
  }

  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  const partialFiles = entries
    .filter((entry) => {
      if (!entry.isFile()) {
        return false;
      }
      const name = entry.name;
      return /^mochawesome_\d+\.json$/.test(name);
    })
    .map((entry) => path.join(baseDir, entry.name))
    .sort();

  files.push(...partialFiles);

  return files;
}

/**
 * Carrega um arquivo JSON mochawesome
 * @param filePath - Caminho do arquivo JSON
 * @returns String com o conteúdo do arquivo JSON ou null se não existir
 */
async function loadMochawesomeFile(filePath: string): Promise<string | null> {
  try {
    if (!(await fs.pathExists(filePath))) {
      return null;
    }
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error loading mochawesome file ${filePath}:`, error);
    return null;
  }
}

/**
 * Loader para arquivos Cypress (mochawesome.json)
 */
export const loadCypress: Loader = {
  canLoad(file: RawFile): boolean {
    return file.framework === 'cypress-e2e' || file.framework === 'cypress-ct';
  },

  async load(file: RawFile): Promise<string[]> {
    const mochawesomeFiles = await findMochawesomeFiles(file.baseDir);

    if (mochawesomeFiles.length === 0) {
      throw new Error(`No mochawesome files found in ${file.baseDir}`);
    }

    const loadedFiles: string[] = [];
    for (const filePath of mochawesomeFiles) {
      const data = await loadMochawesomeFile(filePath);
      if (data) {
        loadedFiles.push(data);
      }
    }

    if (loadedFiles.length === 0) {
      throw new Error(`Failed to load any mochawesome files from ${file.baseDir}`);
    }

    return loadedFiles;
  },
};

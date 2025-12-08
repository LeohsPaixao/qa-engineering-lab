import fs from 'fs-extra';
import path from 'path';
import { Loader, RawFile } from '../types';

/**
 * Encontra todos os arquivos XML do Selenium no diretório (TEST-*.xml)
 * @param baseDir - Diretório base para buscar os arquivos
 * @returns Array de strings com os caminhos dos arquivos encontrados
 */
async function findSeleniumFiles(baseDir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await fs.readdir(baseDir, { withFileTypes: true });
    const xmlFiles = entries
      .filter((entry) => {
        if (!entry.isFile()) {
          return false;
        }
        const name = entry.name;
        return /^TEST-.*\.xml$/.test(name);
      })
      .map((entry) => path.join(baseDir, entry.name))
      .sort();

    files.push(...xmlFiles);
  } catch (error) {
    throw new Error(`Error reading directory ${baseDir}: ${error instanceof Error ? error.message : String(error)}`);
  }

  return files;
}

/**
 * Carrega um arquivo XML do Selenium como string
 * @param filePath - Caminho do arquivo XML
 * @returns String com o conteúdo do arquivo XML ou null se não existir
 */
async function loadSeleniumFile(filePath: string): Promise<string | null> {
  try {
    if (!(await fs.pathExists(filePath))) {
      return null;
    }
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error loading Selenium file ${filePath}:`, error);
    return null;
  }
}

/**
 * Loader para arquivos Selenium (TEST-*.xml)
 */
export const loadSelenium: Loader = {
  canLoad(file: RawFile): boolean {
    return file.framework === 'selenium-e2e';
  },

  async load(file: RawFile): Promise<string[]> {
    const seleniumFiles = await findSeleniumFiles(file.baseDir);

    if (seleniumFiles.length === 0) {
      throw new Error(`No Selenium XML files (TEST-*.xml) found in ${file.baseDir}`);
    }

    const loadedFiles: string[] = [];
    for (const filePath of seleniumFiles) {
      const content = await loadSeleniumFile(filePath);
      if (content) {
        loadedFiles.push(content);
      }
    }

    if (loadedFiles.length === 0) {
      throw new Error(`Failed to load any Selenium XML files from ${file.baseDir}`);
    }

    return loadedFiles;
  },
};

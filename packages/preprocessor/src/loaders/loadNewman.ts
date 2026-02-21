import fs from 'fs-extra';
import path from 'path';
import { Loader, RawFile } from '../types';

/**
 * Loader para arquivos results.xml do Newman
 */
export const loadNewman: Loader = {
  canLoad(file: RawFile): boolean {
    return file.framework === 'newman';
  },

  async load(file: RawFile): Promise<string> {
    const resultsPath = path.join(file.baseDir, 'results.xml');

    if (!(await fs.pathExists(resultsPath))) {
      throw new Error(`Arquivo results.xml não encontrado em ${file.baseDir}`);
    }

    try {
      const content = await fs.readFile(resultsPath, 'utf-8');
      return content;
    } catch (error) {
      throw new Error(`Erro ao ler o arquivo results.xml: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

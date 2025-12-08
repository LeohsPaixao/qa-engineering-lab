import fs from 'fs-extra';
import path from 'path';
import { Loader, RawFile } from '../types';
import { VitestData } from '../types/vitest.types';

/**
 * Loader para arquivos Vitest (results.json)
 */
export const loadVitest: Loader = {
  canLoad(file: RawFile): boolean {
    return file.framework === 'vitest';
  },

  async load(file: RawFile): Promise<VitestData> {
    const resultsPath = path.join(file.baseDir, 'results.json');

    if (!(await fs.pathExists(resultsPath))) {
      throw new Error(`No results.json file found in ${file.baseDir}`);
    }

    try {
      const results = await fs.readJSON(resultsPath);
      return results;
    } catch (error) {
      throw new Error(`Error loading Vitest results from ${resultsPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

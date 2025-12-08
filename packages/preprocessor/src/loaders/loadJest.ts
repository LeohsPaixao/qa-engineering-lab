import fs from 'fs-extra';
import path from 'path';
import { Loader, RawFile } from '../types';
import { JestData } from '../types/jest.types';

/**
 * Loader para arquivos Jest (results.json)
 */
export const loadJest: Loader = {
  canLoad(file: RawFile): boolean {
    return file.framework === 'jest';
  },

  async load(file: RawFile): Promise<JestData> {
    const resultsPath = path.join(file.baseDir, 'results.json');

    if (!(await fs.pathExists(resultsPath))) {
      throw new Error(`No results.json file found in ${file.baseDir}`);
    }

    try {
      const results = await fs.readJSON(resultsPath);
      return results;
    } catch (error) {
      throw new Error(`Error loading Jest results from ${resultsPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

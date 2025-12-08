import fs from 'fs-extra';
import path from 'path';
import { Loader, RawFile } from '../types';
import { PlaywrightData } from '../types/playwright.types';

/**
 * Loader para arquivos Playwright (results.json)
 */
export const loadPlaywright: Loader = {
  canLoad(file: RawFile): boolean {
    return file.framework === 'playwright-e2e' || file.framework === 'playwright-ct';
  },

  async load(file: RawFile): Promise<PlaywrightData> {
    const resultsPath = path.join(file.baseDir, 'results.json');

    if (!(await fs.pathExists(resultsPath))) {
      throw new Error(`No results.json file found in ${file.baseDir}`);
    }

    try {
      const results = await fs.readJSON(resultsPath);
      return results;
    } catch (error) {
      throw new Error(`Error loading Playwright results from ${resultsPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

import fs from 'fs-extra';
import path from 'path';
import { Loader, RawFile } from '../types';

/**
 * Loader para arquivos Robot Framework (output.xml)
 */
export const loadRobot: Loader = {
  canLoad(file: RawFile): boolean {
    return file.framework === 'robot-e2e';
  },

  async load(file: RawFile): Promise<string> {
    const resultsPath = path.join(file.baseDir, 'output.xml');

    if (!(await fs.pathExists(resultsPath))) {
      throw new Error(`No output.xml file found in ${file.baseDir}`);
    }

    try {
      const content = await fs.readFile(resultsPath, 'utf-8');
      return content;
    } catch (error) {
      throw new Error(`Error loading Robot Framework results from ${resultsPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

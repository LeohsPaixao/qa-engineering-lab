import fs from 'fs';
import path from 'path';
import { PreprocessorConfig } from '../types';

/**
 * Encontra a raiz do workspace procurando pelo package.json do workspace ou pelo diretório qa-results
 */
function findWorkspaceRoot(): string {
  let currentDir = process.cwd();

  while (currentDir !== path.dirname(currentDir)) {
    const qaResultsPath = path.join(currentDir, 'qa-results');
    if (fs.existsSync(qaResultsPath)) {
      return currentDir;
    }

    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        if (packageJson.workspaces && Array.isArray(packageJson.workspaces)) {
          return currentDir;
        }
      } catch {}
    }

    currentDir = path.dirname(currentDir);
  }

  return process.cwd();
}

/**
 * Configuração padrão do preprocessador
 */
export const defaultConfig: PreprocessorConfig = {
  rawDir: path.join(findWorkspaceRoot(), 'qa-results', 'raw'),
  processedDir: path.join(findWorkspaceRoot(), 'qa-results', 'processed'),
  logLevel: 'normal',
};

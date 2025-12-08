import fs from 'fs-extra';
import { PreprocessorConfig } from '../types';

/**
 * Limpa o diretório processed
 * @param config - a configuração do preprocessador
 * @returns void
 */
export async function cleanProcessedDirectory(config: PreprocessorConfig): Promise<void> {
  const { processedDir } = config;
  await fs.emptyDir(processedDir);
}

/**
 * Limpa o diretório raw
 * @param config - a configuração do preprocessador
 * @returns void
 */
export async function cleanRawDirectory(config: PreprocessorConfig): Promise<void> {
  const { rawDir } = config;
  await fs.emptyDir(rawDir);
}

/**
 * Limpa todos os diretórios
 * @param config - a configuração do preprocessador
 * @returns void
 */
export async function cleanAll(config: PreprocessorConfig): Promise<void> {
  await cleanProcessedDirectory(config);
  await cleanRawDirectory(config);
}

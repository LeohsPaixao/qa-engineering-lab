import { getLoaderFor } from '../loaders';
import { getParserFor } from '../parsers';
import { normalizedFrameworkDataSchema, summarySchema } from '../schema/zodSchema';
import { generateSummarySvg } from '../svg/generateSummarySvg';
import { Framework, NormalizedFrameworkData, ParsedData, PreprocessorConfig } from '../types';
import { cleanProcessedDirectory } from './cleaner';
import { normalize } from './normalizer';
import { consolidateSummary, saveProcessedFile, saveSummaryFile } from './saver';
import { scanRawDirectory } from './scanner';

/**
 * Orquestra o processo de preprocessamento
 * 1. Analisa o diretório raw para encontrar arquivos de resultados de testes
 * 2. Carrega o arquivo usando o loader apropriado
 * 3. Analisa o arquivo usando o parser apropriado
 * 4. Normaliza os dados analisados
 * 5. Limpa o diretório processed
 * 6. Salva os dados normalizados no diretório processed
 * 7. Consolida todos os dados e cria o summary.json
 * @param config - configuração do preprocessador
 * @returns void
 */
export async function orchestrator(config: PreprocessorConfig): Promise<void> {
  const rawFiles = await scanRawDirectory(config.rawDir);

  if (rawFiles.length === 0) {
    throw new Error('No raw files found to process');
  }

  const normalizedResults: NormalizedFrameworkData[] = [];
  const processedRawFiles: Array<{ path: string; framework: Framework }> = [];

  await cleanProcessedDirectory(config);

  for (const rawFile of rawFiles) {
    try {
      const loader = getLoaderFor(rawFile);
      const content = await loader.load(rawFile);

      const parser = getParserFor(rawFile);
      const parsed: ParsedData = await parser.parse(content, rawFile);

      const normalized = normalize(parsed);
      const validatedNormalized = normalizedFrameworkDataSchema.safeParse(normalized);

      if (!validatedNormalized.success) {
        throw new Error('Invalid normalized data');
      }

      const normalizedData = validatedNormalized.data as NormalizedFrameworkData;

      normalizedResults.push(normalizedData);
      processedRawFiles.push({ path: rawFile.path, framework: rawFile.framework });

      await saveProcessedFile(normalizedData, config);
    } catch (error) {
      if (error instanceof Error && (error.message.includes('No loader found') || error.message.includes('No parser found'))) {
        continue;
      }
      throw error;
    }
  }

  const summary = consolidateSummary(normalizedResults, processedRawFiles);
  const validatedSummary = summarySchema.safeParse(summary);

  if (!validatedSummary.success) {
    throw new Error('Invalid summary data');
  }

  await saveSummaryFile(validatedSummary.data, config);
  await generateSummarySvg(validatedSummary.data, config);
}

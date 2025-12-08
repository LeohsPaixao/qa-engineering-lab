import fs from 'fs-extra';
import path from 'path';
import { Framework, NormalizedFrameworkData, PreprocessorConfig, SummaryData, TestSummary } from '../types';

/**
 * Salva o arquivo processado no diretório processed
 * @param normalized - os dados normalizados
 * @param config - a configuração do preprocessador
 * @returns void
 */
export async function saveProcessedFile(normalized: NormalizedFrameworkData, config: PreprocessorConfig): Promise<void> {
  const { processedDir } = config;

  const fileName = `${normalized.framework}.json`;
  const filePath = path.join(processedDir, fileName);

  await fs.writeJSON(filePath, normalized, { spaces: 2 });
}

/**
 * Consolida todos os dados normalizados em um SummaryData
 * @param normalizedResults - Array de dados normalizados de cada framework
 * @param rawFiles - Array de arquivos raw processados
 * @returns Dados consolidados para o summary.json
 */
export function consolidateSummary(
  normalizedResults: NormalizedFrameworkData[],
  rawFiles: Array<{ path: string; framework: Framework }>,
): SummaryData {
  const byFramework: Record<Framework, TestSummary> = {} as Record<Framework, TestSummary>;
  const overall: TestSummary = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration_s: 0,
  };

  for (const normalized of normalizedResults) {
    byFramework[normalized.framework] = normalized.summary;

    overall.total += normalized.summary.total;
    overall.passed += normalized.summary.passed;
    overall.failed += normalized.summary.failed;
    overall.skipped += normalized.summary.skipped;
    overall.duration_s += normalized.summary.duration_s;
  }

  const timestamps = normalizedResults
    .map((r) => r.timestamp)
    .sort()
    .reverse();
  const latestTimestamp = timestamps[0];

  let timestamp: string;
  if (latestTimestamp) {
    timestamp = latestTimestamp;
  } else {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timestamp = `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
  }

  const processedFiles = normalizedResults.map((r) => `${r.framework}.json`);
  const rawFilesPaths = rawFiles.map((f) => path.basename(f.path));

  return {
    timestamp,
    generatedAt: new Date().toISOString(),
    overall,
    byFramework,
    artifacts: {
      processedFiles,
      rawFiles: rawFilesPaths,
    },
  };
}

/**
 * Salva o arquivo summary.json no diretório processed
 * @param summary - os dados consolidados do summary
 * @param config - a configuração do preprocessador
 * @returns void
 */
export async function saveSummaryFile(summary: SummaryData, config: PreprocessorConfig): Promise<void> {
  const { processedDir } = config;

  const fileName = 'summary.json';
  const filePath = path.join(processedDir, fileName);

  await fs.writeJSON(filePath, summary, { spaces: 2 });
}

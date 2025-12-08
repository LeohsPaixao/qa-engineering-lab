import { defaultConfig } from './core/config';
import { orchestrator } from './core/orchestrator';

/**
 * Executa o preprocessador com a configuração padrão
 */
async function main() {
  try {
    const config = defaultConfig;
    await orchestrator(config);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();

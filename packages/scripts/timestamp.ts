/**
 * Gera um carimbo de data/hora no formato YYYY-MM-DD-HH-MM-SS representando o instante em UTC.
 *
 * @returns A string contendo a data e hora formatadas como `YYYY-MM-DD-HH-MM-SS` (UTC)
 */
export function timestamp(): string {
  return new Date()
    .toISOString()
    .replace(/:/g, '-')
    .replace('T', '-')
    .split('.')[0];
}

const isMainModule = (() => {
  if (typeof process === 'undefined') return false;
  const scriptPath = process.argv[1] || '';
  return scriptPath.includes('timestamp.ts') || scriptPath.endsWith('timestamp');
})();

if (isMainModule) {
  console.log(timestamp());
}
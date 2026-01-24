/**
 * Determina a categoria do framework a partir do nome fornecido.
 *
 * @param frameworkName - String que identifica o framework (por exemplo, um nome ou identificador)
 * @returns `'ct'` se `frameworkName` contiver `'ct'`, `'e2e'` se contiver `'e2e'`, `'unit'` se contiver `'jest'` ou `'vitest'`, `'default'` caso contrário
 */
export function getFrameworkType(frameworkName: string): string {
  if (frameworkName.endsWith('ct')) {
    return 'ct';
  }
  if (frameworkName.endsWith('e2e')) {
    return 'e2e';
  }
  if (frameworkName.includes('jest') || frameworkName.includes('vitest')) {
    return 'unit';
  }
  if (frameworkName.includes('rest-assured')) {
    return 'api';
  }

  return 'default';
}

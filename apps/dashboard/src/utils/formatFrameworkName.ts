/**
 * Formata o identificador de framework para um nome legível para exibição.
 *
 * @param name - Identificador do framework (por exemplo: 'jest', 'cypress-e2e')
 * @returns O nome legível do framework quando existir mapeamento, `name` inalterado caso contrário
 */
export function formatFrameworkName(name: string): string {
  const names: Record<string, string> = {
    'cypress-ct': 'Cypress CT',
    'cypress-e2e': 'Cypress E2E',
    jest: 'Jest',
    'playwright-e2e': 'Playwright',
    'robot-e2e': 'Robot Framework',
    'selenium-e2e': 'Selenium',
    vitest: 'Vitest',
  };
  return names[name] || name;
}

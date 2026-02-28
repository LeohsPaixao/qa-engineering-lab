import { FRAMEWORK_CONFIG } from '@/types';

/**
 * Formata o identificador de framework para um nome legível para exibição.
 *
 * @param name - Identificador do framework (por exemplo: 'jest', 'cypress-e2e')
 * @returns O nome legível do framework quando existir mapeamento, `name` inalterado caso contrário
 */
export function formatFrameworkName(name: string): string {
  return FRAMEWORK_CONFIG[name as keyof typeof FRAMEWORK_CONFIG]?.displayName ?? name;
}

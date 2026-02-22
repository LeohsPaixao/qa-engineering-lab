import { FRAMEWORK_CONFIG } from '@/types';

export function getFrameworkType(frameworkName: string): string {
  return FRAMEWORK_CONFIG[frameworkName as keyof typeof FRAMEWORK_CONFIG]?.type ?? 'default';
}

import type { FrameworkSummary } from './results.types';

export interface CardProps {
  framework: string;
  summary: FrameworkSummary;
  type: string;
}

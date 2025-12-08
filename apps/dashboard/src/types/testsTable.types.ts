import type { TestResult } from './results.types';

export interface TestsTableProps {
  tests: TestResult[];
  title?: string;
  showError?: boolean;
  itemsPerPage?: number;
}

interface FrameworkData {
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
}

export interface BarChartProps {
  frameworks: FrameworkData[];
  title?: string;
}

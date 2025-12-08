interface DataPoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: DataPoint[];
  title?: string;
  label?: string;
  color?: string;
}

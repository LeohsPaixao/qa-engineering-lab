export interface SummaryCardProps {
  title: string;
  value: string | number;
  label?: string;
  trend?: number;
  icon?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

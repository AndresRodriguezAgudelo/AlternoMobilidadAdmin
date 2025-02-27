export interface FilterOption {
  label: string;
  type: 'date' | 'select';
  options?: string[];
  header: string;
}

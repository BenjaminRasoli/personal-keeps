export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export interface SearchBarWithFilterProps<T> extends SearchBarProps {
  items?: T[];
  onFiltered?: (filtered: T[]) => void;
}

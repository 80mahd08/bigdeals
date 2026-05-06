export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PagedResponse<T> {
  items: T[];
  page: number;         // Legacy backend name
  pageNumber: number;   // New Phase 1 name
  pageSize: number;
  totalCount: number;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface FilterParams {
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

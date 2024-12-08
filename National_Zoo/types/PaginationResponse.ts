export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
  }
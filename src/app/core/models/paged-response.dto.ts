export interface PagedResponse<T> {
    message: string;
    data: T[];
    totalItems: number;
    page: number;
    pageSize: number;
  }
  
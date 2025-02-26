export interface Query {
  id: number;
  search: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface QueryResponse {
  data: Query[];
  meta: {
    page: string;
    take: string;
    total: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface QueryParams {
  page?: number;
  take?: number;
  search?: string;
  order?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
}

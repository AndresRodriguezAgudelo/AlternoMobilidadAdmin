export interface QueryUser {
  name: string;
}

export interface Query {
  id: number;
  module: string;
  user: QueryUser;
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

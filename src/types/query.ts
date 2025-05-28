export interface QueryUser {
  name: string;
}

export interface Query {
  id: number;
  module: string;
  user: QueryUser;
  createdAt: string;
}

// Tipo que define las claves permitidas para filtrado
export type QueryFilterKeys = keyof Query | 'user.name';

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
  module?: string;
}

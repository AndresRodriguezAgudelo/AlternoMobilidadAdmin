export interface Guide {
  id: number;
  name: string;
  categoryId: number;
  keyMain: string;
  keySecondary: string;
  keyTertiaryVideo: string;
  description: string;
}

export interface GuideResponse {
  data: Guide[];
  meta: {
    page: string;
    take: string;
    total: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface GuideParams {
  page?: number;
  take?: number;
  search?: string;
  order?: 'ASC' | 'DESC';
}

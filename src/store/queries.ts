import { create } from 'zustand';
import { Query, QueryResponse } from '../types/query';

interface QueriesState {
  queries: Query[];
  meta: QueryResponse['meta'] | null;
  setQueries: (queries: Query[]) => void;
  setMeta: (meta: QueryResponse['meta']) => void;
  clearQueries: () => void;
}

export const useQueriesStore = create<QueriesState>((set) => ({
  queries: [],
  meta: null,
  setQueries: (queries) => set({ queries }),
  setMeta: (meta) => set({ meta }),
  clearQueries: () => set({ queries: [], meta: null })
}));

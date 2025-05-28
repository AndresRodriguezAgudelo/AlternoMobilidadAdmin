import { create } from 'zustand';
import { Query, QueryResponse, QueryFilterKeys } from '../types/query';

interface QueriesState {
  // Estado
  queries: Query[];
  filteredQueries: Query[];
  meta: QueryResponse['meta'] | null;
  
  // Acciones
  setQueries: (queries: Query[]) => void;
  setMeta: (meta: QueryResponse['meta']) => void;
  clearQueries: () => void;
  
  // Filtrado local
  filterQueries: (filters: Partial<Record<QueryFilterKeys, string>>) => void;
}

const getQueryValue = (query: Query, key: QueryFilterKeys): string | undefined => {
  if (key === 'user.name') {
    return query.user?.name;
  }
  if (key in query) {
    const value = query[key as keyof Query];
    return value?.toString();
  }
  return undefined;
};

export const useQueriesStore = create<QueriesState>((set, get) => ({
  // Estado inicial
  queries: [],
  filteredQueries: [],
  meta: null,

  // Acciones básicas
  setQueries: (queries) => set({ 
    queries,
    filteredQueries: queries // Inicialmente, filteredQueries es igual a queries
  }),
  setMeta: (meta) => set({ meta }),
  clearQueries: () => set({ 
    queries: [], 
    filteredQueries: [],
    meta: null 
  }),

  // Función de filtrado local
  filterQueries: (filters) => {
    const { queries } = get();
    
    // Si no hay filtros, mostrar todas las queries
    if (!filters || Object.keys(filters).length === 0) {
      set({ filteredQueries: queries });
      return;
    }

    // Filtrar queries basado en los filtros proporcionados
    const filtered = queries.filter(query => {
      return Object.entries(filters).every(([key, value]) => {
        // Si el valor del filtro está vacío, no aplicar este filtro
        if (!value) return true;

        // Obtener el valor del query para la key actual
        const queryValue = getQueryValue(query, key as QueryFilterKeys);
        if (!queryValue) return false;

        // Comparar valores
        return queryValue.toLowerCase() === value.toLowerCase();
      });
    });
    set({ filteredQueries: filtered });
  }
}));

import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';
import { useQueriesStore } from '../../../store/queries';
import { QueryParams, QueryResponse } from '../../../types/query';

export const useQueries = () => {
  const { queries: storedQueries, filteredQueries, setQueries, meta, setMeta, filterQueries } = useQueriesStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uniqueModules, setUniqueModules] = useState<string[]>([]);
  const [params, setParams] = useState<QueryParams>({
    page: 1,
    take: 10,
    order: 'ASC'
  });

  const fetchQueries = async (
    page: number = 1,
    take: number = 10,
    order: 'ASC' | 'DESC' = 'ASC',
    search?: string,
    startDate?: string,
    endDate?: string,
    module?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams: Record<string, any> = {
        page,
        take,
        order
      };

      if (search) queryParams.search = search;
      if (startDate) queryParams.startDate = startDate;
      if (endDate) queryParams.endDate = endDate;
      if (module) queryParams.module = module;

      const response = await api.get<QueryResponse>(ENDPOINTS.QUERIES.LIST, {
        params: queryParams
      });

      const newData = response.data.data;
      setQueries(newData);
      setMeta(response.data.meta);
      
      // Actualizar módulos únicos
      const modules = newData.map(item => item.module);
      setUniqueModules(prev => {
        const allModules = [...prev, ...modules];
        return [...new Set(allModules)];
      });
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('[Queries Hook] Error fetching queries:', err);
      setError('Error al cargar las búsquedas');
      return { success: false, error: 'Error al cargar las búsquedas' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storedQueries.length > 0 && 
        params.page === 1 && 
        params.take === 10 && 
        params.order === 'ASC' && 
        !params.search) {
      setLoading(false);
      return;
    }

    fetchQueries(
      params.page,
      params.take,
      params.order,
      params.search,
      params.startDate,
      params.endDate,
      params.module
    );
  }, [params]);

  return {
    queries: filteredQueries, // Usar las queries filtradas en lugar de todas las queries
    allQueries: storedQueries, // Mantener acceso a todas las queries si es necesario
    loading,
    error,
    meta,
    uniqueModules,
    fetchQueries,
    setParams,
    filterQueries // Exponer la función de filtrado
  };
};

export const queryTableHeaders = [
  { key: 'id', label: 'ID' },
  { key: 'module', label: 'Módulo' },
  { key: 'user', label: 'Usuario' }
];

// Renderer personalizado para mostrar el nombre del usuario
export const customRenderers = {
  'user': (user: any) => user?.name || 'N/A'
};

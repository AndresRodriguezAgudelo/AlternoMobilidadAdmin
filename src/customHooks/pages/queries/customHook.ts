import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';

import { QueryResponse } from '../../../types/query';

export const useQueries = () => {
  const [queries, setQueries] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});
  const [modulesList, setModulesList] = useState<{ value: string; label: string }[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [sortKey, setSortKey] = useState<string>('createdAt');

  // Cargar módulos al iniciar
  useEffect(() => {
    fetchQueries(1, 50, 'DESC');
  }, []);

  // Cargar lista de módulos
  useEffect(() => {
    api.get(ENDPOINTS.QUERIES.MODULES)
      .then(({ data }) => {
        const arr = Array.isArray(data) ? data : data.data;
        setModulesList(arr.map((m: string) => ({ value: m, label: m })));
      })
      .catch(err => console.error('Error fetching modules:', err));
  }, []);

  const downloadQueriesReport = async () => {
    setIsDownloading(true);
    try {
      const url = ENDPOINTS.REPORTS.DOWNLOAD('querys');
      // Configuramos los parámetros y el tipo de respuesta para descarga
      const response = await api.get(`${url}?order=ASC&page=1&take=50`, { 
        responseType: 'blob',
        headers: {
          'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });
      
      // Crear y descargar el archivo
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'queries-report.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const fetchQueries = async (page: number, take: number, order: string, search?: string, startDate?: string, endDate?: string, module?: string) => {
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

      setQueries(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      console.error('[Queries Hook] Error fetching queries:', err);
      setError('Error al cargar las búsquedas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchQueries(1, 50, 'DESC', value, currentFilters.startDate, currentFilters.endDate, selectedModule);
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    setCurrentFilters(filterValues);
  };

  const handleApplyFilters = (formattedFilters: Record<string, any>) => {
    setCurrentFilters(formattedFilters);
    fetchQueries(1, 50, 'DESC', searchTerm, formattedFilters.startDate, formattedFilters.endDate, selectedModule);
  };

  const handlePageChange = (page: number) => {
    fetchQueries(page, 50, sortOrder, searchTerm, currentFilters.startDate, currentFilters.endDate, selectedModule);
  };

  const handleSort = (key: string, order: 'ASC' | 'DESC') => {
    setSortKey(key);
    setSortOrder(order);
    fetchQueries(1, 50, order, searchTerm, currentFilters.startDate, currentFilters.endDate, selectedModule);
  };

  return {
    queries,
    loading,
    error,
    meta,
    fetchQueries,
    modulesList,
    selectedModule,
    setSelectedModule,
    currentFilters,
    setCurrentFilters,
    searchTerm,
    setSearchTerm,
    isDownloading,
    downloadQueriesReport,
    handleSearch,
    handleFilterChange,
    handleApplyFilters,
    handlePageChange,
    handleSort,
    sortKey,
    sortOrder
  };
};

export const queryTableHeaders = [
  { key: 'id', label: 'ID Consulta' },
  { key: 'user', label: 'Usuario Consultante' },
  { key: 'module', label: 'Módulo de consulta' },
  { key: 'createdAt', label: 'F. consulta', sortable: true, sortKey: 'createdAt' }
];

export const customRenderers = {
  'user': (user: any) => user?.name || 'N/A',
  'createdAt': (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
};

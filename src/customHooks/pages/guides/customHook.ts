import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';
import { useGuidesStore } from '../../../store/guides';
import { GuideParams, GuideResponse } from '../../../types/guide';

export const useGuides = () => {
  const { guides, meta, setGuides, setMeta } = useGuidesStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GuideParams>({
    page: 1,
    take: 10,
    order: 'ASC'
  });

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<GuideResponse>(ENDPOINTS.GUIDES.LIST, {
        params
      });
      console.log('[fetchGuides] Respuesta:', response.data);
      if (!response.data.data || response.data.data.length === 0) {
        console.warn('[fetchGuides] No hay guías disponibles');
      }
      setGuides(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las guías');
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [params]);

  return {
    guides,
    loading,
    error,
    meta,
    setParams,
    fetchGuides
  };
};

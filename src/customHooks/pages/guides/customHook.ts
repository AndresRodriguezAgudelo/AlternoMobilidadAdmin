import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';
import { useGuidesStore } from '../../../store/guides';
import { GuideParams, GuideResponse } from '../../../types/guide';

interface DeleteGuideResult {
  success: boolean;
  error?: string;
}

export const useGuides = () => {
  const { guides, meta, setGuides, setMeta } = useGuidesStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [params, setParams] = useState<GuideParams>({
    page: 1,
    take: 20,
    order: 'DESC'
  });

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<GuideResponse>(ENDPOINTS.GUIDES.LIST, {
        params
      });
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

  /**
   * Elimina una guía por su ID
   * @param id ID de la guía a eliminar
   * @returns Objeto con el resultado de la operación
   */
  const deleteGuide = async (id: number): Promise<DeleteGuideResult> => {
    setDeleteLoading(true);
    try {
      await api.delete(ENDPOINTS.GUIDES.DETAIL(id));
      await fetchGuides(); // Recargar la lista después de eliminar
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar guía:', err);
      setError('Error al eliminar la guía');
      return { success: false, error: 'Error al eliminar la guía' };
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    guides,
    loading,
    error,
    meta,
    setParams,
    fetchGuides,
    deleteGuide,
    deleteLoading
  };
};

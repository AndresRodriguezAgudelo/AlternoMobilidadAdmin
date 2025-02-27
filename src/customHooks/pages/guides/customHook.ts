import { useState, useEffect } from 'react';
import axios from 'axios';
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

      const token = localStorage.getItem('token');
      const response = await axios.get<GuideResponse>('/api/sign/v1/guides', {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

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

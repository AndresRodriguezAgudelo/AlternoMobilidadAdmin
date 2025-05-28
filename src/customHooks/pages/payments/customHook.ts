import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';


export interface PaymentData {
  id: number;
  createdAt: string;
  module: string;
  user: {
    name: string;
  };
}

export interface PaymentMeta {
  page: string;
  take: string;
  total: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const usePaymentData = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [meta, setMeta] = useState<PaymentMeta | null>(null);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [sortKey, setSortKey] = useState<string>('createdAt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (
    page: number = 1,
    take: number = 50,
    order: 'ASC' | 'DESC' = 'DESC',
    search: string = '',
    startDate?: string,
    endDate?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page,
        take,
        order,
        module: 'Link de pago'
      };
      
      // Si hay un término de búsqueda, agregarlo a los parámetros
      if (search) params.search = search;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await api.get<{ data: PaymentData[]; meta: PaymentMeta }>(ENDPOINTS.QUERIES.LIST, {
        params
      });
      setPayments(response.data.data);
      setMeta(response.data.meta);
    } catch (err: any) {
      setError('Error al cargar los pagos');
      setPayments([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, []);

  const handleSort = (key: string, order: 'ASC' | 'DESC') => {
    setSortKey(key);
    setSortOrder(order);
    fetchPayments(1, 50, order);
  };

  return {
    payments,
    loading,
    error,
    meta,
    fetchPayments,
    handleSort,
    sortKey,
    sortOrder
  };
};

export const paymentTableHeaders = [
  { key: 'id', label: 'ID Evento' },
  { key: 'user', label: 'Usuario' },
  { key: 'createdAt', label: 'Fecha de creación', sortable: true, sortKey: 'createdAt' }
];

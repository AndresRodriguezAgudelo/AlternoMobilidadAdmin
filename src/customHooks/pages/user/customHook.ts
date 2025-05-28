import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';

import { User, UserParams, UserResponse } from '../../../types/user';

export const useUserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<UserResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [sortKey, setSortKey] = useState<string>('createdAt');
  const [params, setParams] = useState<UserParams>({
    page: 1,
    take: 50,
    order: 'ASC'
  });

  const fetchUsers = async (
    page: number = 1,
    take: number = 50,
    order: 'ASC' | 'DESC' = 'ASC',
    search?: string,
    startDate?: string,
    endDate?: string,
    totalVehicles?: number,
    status?: boolean
  ) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams: Record<string, any> = {
        page,
        take,
        order
      };

      // Agregar parámetros de búsqueda y filtros solo si están definidos
      if (search) queryParams.search = search;
      if (startDate) queryParams.startDate = startDate;
      if (endDate) queryParams.endDate = endDate;
      if (typeof totalVehicles !== 'undefined') queryParams.totalVehicles = totalVehicles;
      if (typeof status !== 'undefined') queryParams.status = status;

      const response = await api.get<UserResponse>(ENDPOINTS.USERS.LIST, {
        params: queryParams
      });

      setUsers(response.data.data);
      setMeta(response.data.meta);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('[Users Hook] Error fetching users:', err);
      setError('Error al cargar los usuarios');
      return { success: false, error: 'Error al cargar los usuarios' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(
      params.page,
      params.take,
      params.order,
      params.search,
      params.startDate,
      params.endDate,
      params.totalVehicles
    );
  }, [params]);

  const updateUserStatus = async (userId: number, newStatus: boolean) => {
    try {
      setLoading(true);
      await api.patch(ENDPOINTS.USERS.UPDATE(userId), { status: newStatus });
      
      // Actualizar el estado local
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      
      return { success: true };
    } catch (err) {
      console.error('[Users Hook] Error updating user status:', err);
      setError('Error al actualizar el estado del usuario');
      return { success: false, error: 'Error al actualizar el estado del usuario' };
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string, order: 'ASC' | 'DESC') => {
    setSortKey(key);
    setSortOrder(order);
    fetchUsers(
      params.page,
      params.take,
      order,
      params.search,
      params.startDate,
      params.endDate,
      params.totalVehicles,
      params.status
    );
  };

  return {
    users,
    loading,
    error,
    meta,
    fetchUsers,
    setParams,
    updateUserStatus,
    handleSort,
    sortKey,
    sortOrder
  };
};

export const userTableHeaders = [
  { key: 'name', label: 'Nombre' },
  { key: 'phone', label: 'Celular' },
  { key: 'email', label: 'Correo' },
  { key: 'userVehicles', label: 'Vehículos', isModal: true },
  { key: 'createdAt', label: 'F. Registro', sortable: true, sortKey: 'createdAt' },
  { key: 'status', label: 'Estado' }
];

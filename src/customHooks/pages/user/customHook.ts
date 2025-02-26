import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';
import { useUsersStore } from '../../../store/users';
import { UserParams, UserResponse } from '../../../types/user';

export const useUserData = () => {
  const { users: storedUsers, setUsers, meta, setMeta } = useUsersStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<UserParams>({
    page: 1,
    take: 10,
    order: 'ASC'
  });

  const fetchUsers = async (
    page: number = 1,
    take: number = 10,
    order: 'ASC' | 'DESC' = 'ASC',
    search?: string,
    startDate?: string,
    endDate?: string,
    totalVehicles?: number
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
      if (totalVehicles) queryParams.totalVehicles = totalVehicles;

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
    if (storedUsers.length > 0 && 
        params.page === 1 && 
        params.take === 10 && 
        params.order === 'ASC' && 
        !params.search) {
      setLoading(false);
      return;
    }

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

  return {
    users: storedUsers,
    loading,
    error,
    meta,
    fetchUsers,
    setParams
  };
};

export const userTableHeaders = [
  { key: 'name', label: 'Nombre' },
  { key: 'phone', label: 'Celular' },
  { key: 'email', label: 'Correo' },
  { key: 'userVehicles', label: 'Vehículos', isModal: true },
  { key: 'accepted', label: 'Estado' }
];

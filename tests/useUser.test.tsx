/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useUserData } from '../src/customHooks/pages/user/customHook';

// Mock de las dependencias
jest.mock('../src/services/api', () => ({
  api: {
    get: jest.fn(),
    patch: jest.fn()
  },
  handleApiError: jest.fn().mockReturnValue({ success: false, error: 'Error al cargar los usuarios' })
}));

jest.mock('../src/services/endPoints', () => ({
  ENDPOINTS: {
    USERS: {
      LIST: '/mock-users-endpoint',
      UPDATE: (id) => `/mock-users-endpoint/${id}`
    }
  }
}));

// Importamos los mocks para poder manipularlos en los tests
import { api } from '../src/services/api';

describe('useUserData Hook', () => {
  // Datos de ejemplo para los mocks
  const mockUsers = [
    {
      id: 1,
      name: 'Usuario 1',
      email: 'usuario1@example.com',
      phone: '1234567890',
      status: true,
      createdAt: '2023-01-01T12:00:00Z',
      userVehicles: 2
    },
    {
      id: 2,
      name: 'Usuario 2',
      email: 'usuario2@example.com',
      phone: '0987654321',
      status: false,
      createdAt: '2023-01-02T12:00:00Z',
      userVehicles: 1
    }
  ];

  const mockMeta = {
    page: '1',
    take: '50',
    total: 2,
    pageCount: 1,
    hasPreviousPage: false,
    hasNextPage: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar el mock por defecto para la API de usuarios
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockUsers,
        meta: mockMeta
      }
    });

    // Mock para actualizar el estado del usuario
    (api.patch as jest.Mock).mockResolvedValue({
      data: { success: true }
    });
  });

  test('should initialize with default values and fetch users on mount', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useUserData());
    });
    
    const { result } = hook;
    
    // Verificar que se haya llamado a la API con los parámetros correctos
    expect(api.get).toHaveBeenCalledWith('/mock-users-endpoint', {
      params: {
        page: 1,
        take: 50,
        order: 'ASC'
      }
    });
    
    // Verificar que se hayan actualizado los estados
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.meta).toEqual(mockMeta);
  });

  test('should handle API error when fetching users', async () => {
    // Configurar el mock para simular un error
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useUserData());
    });
    
    const { result } = hook;
    
    // Verificar que se hayan actualizado los estados para reflejar el error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Error al cargar los usuarios');
    expect(result.current.users).toEqual([]);
  });

  test('should fetch users with all filter parameters', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useUserData());
    });
    
    const { result } = hook;
    
    // Resetear el mock para verificar la siguiente llamada
    jest.clearAllMocks();
    
    // Llamar a fetchUsers con todos los parámetros
    await act(async () => {
      await result.current.fetchUsers(
        2, // page
        10, // take
        'DESC', // order
        'test', // search
        '2023-01-01', // startDate
        '2023-01-31', // endDate
        2, // totalVehicles
        true // status
      );
    });
    
    // Verificar que se haya llamado a la API con todos los parámetros
    expect(api.get).toHaveBeenCalledWith('/mock-users-endpoint', {
      params: {
        page: 2,
        take: 10,
        order: 'DESC',
        search: 'test',
        startDate: '2023-01-01',
        endDate: '2023-01-31',
        totalVehicles: 2,
        status: true
      }
    });
  });

  test('should update user params and trigger fetch', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useUserData());
    });
    
    const { result } = hook;
    
    // Resetear el mock para verificar la siguiente llamada
    jest.clearAllMocks();
    
    // Actualizar los parámetros
    await act(async () => {
      result.current.setParams({
        page: 2,
        take: 10,
        order: 'DESC',
        search: 'test'
      });
    });
    
    // Verificar que se haya llamado a la API con los nuevos parámetros
    expect(api.get).toHaveBeenCalledWith('/mock-users-endpoint', {
      params: {
        page: 2,
        take: 10,
        order: 'DESC',
        search: 'test'
      }
    });
  });

  test('should update user status', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useUserData());
    });
    
    const { result } = hook;
    
    // Resetear el mock para verificar la siguiente llamada
    jest.clearAllMocks();
    
    // Actualizar el estado del usuario
    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateUserStatus(1, false);
    });
    
    // Verificar que se haya llamado a la API correctamente
    expect(api.patch).toHaveBeenCalledWith('/mock-users-endpoint/1', { status: false });
    
    // Verificar el resultado
    expect(updateResult).toEqual({ success: true });
    
    // Verificar que se haya actualizado el estado local del usuario
    expect(result.current.users[0].status).toBe(false);
  });

  test('should handle error when updating user status', async () => {
    // Configurar el mock para simular un error
    (api.patch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useUserData());
    });
    
    const { result } = hook;
    
    // Resetear el mock para verificar la siguiente llamada
    jest.clearAllMocks();
    
    // Intentar actualizar el estado del usuario
    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateUserStatus(1, false);
    });
    
    // Verificar que se haya llamado a la API correctamente
    expect(api.patch).toHaveBeenCalledWith('/mock-users-endpoint/1', { status: false });
    
    // Verificar el resultado de error
    expect(updateResult).toEqual({
      success: false,
      error: 'Error al actualizar el estado del usuario'
    });
    
    // Verificar que se haya actualizado el estado de error
    expect(result.current.error).toBe('Error al actualizar el estado del usuario');
  });
});

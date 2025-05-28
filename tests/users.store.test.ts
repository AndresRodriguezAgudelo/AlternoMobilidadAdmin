import { useUsersStore } from '../src/store/users';
import { User } from '../src/types/user';

describe('useUsersStore', () => {
  // Limpiamos el store antes de cada prueba
  beforeEach(() => {
    useUsersStore.getState().clearUsers();
  });

  test('debería inicializarse con un array vacío de usuarios y meta null', () => {
    const { users, meta } = useUsersStore.getState();
    expect(users).toEqual([]);
    expect(meta).toBeNull();
  });

  test('debería actualizar los usuarios correctamente', () => {
    const mockUsers = [
      { 
        id: 1, 
        name: 'Usuario 1', 
        email: 'usuario1@example.com',
        accepted: true,
        status: true,
        phone: '1234567890',
        verify: true,
        userVehicles: []
      },
      { 
        id: 2, 
        name: 'Usuario 2', 
        email: 'usuario2@example.com',
        accepted: true,
        status: true,
        phone: '0987654321',
        verify: true,
        userVehicles: []
      }
    ] as User[];
    
    useUsersStore.getState().setUsers(mockUsers);
    
    const { users } = useUsersStore.getState();
    expect(users).toEqual(mockUsers);
  });

  test('debería actualizar los metadatos correctamente', () => {
    const mockMeta = { 
      page: '1', 
      take: '10', 
      total: 10, 
      pageCount: 2, 
      hasPreviousPage: false,
      hasNextPage: true
    };
    
    useUsersStore.getState().setMeta(mockMeta);
    
    const { meta } = useUsersStore.getState();
    expect(meta).toEqual(mockMeta);
  });

  test('debería limpiar los usuarios y metadatos', () => {
    // Primero establecemos algunos datos
    const mockUsers = [{ 
      id: 1, 
      name: 'Usuario 1', 
      email: 'usuario1@example.com',
      accepted: true,
      status: true,
      phone: '1234567890',
      verify: true,
      userVehicles: []
    }] as User[];
    const mockMeta = { 
      page: '1', 
      take: '10', 
      total: 10, 
      pageCount: 2, 
      hasPreviousPage: false,
      hasNextPage: true
    };
    
    useUsersStore.getState().setUsers(mockUsers);
    useUsersStore.getState().setMeta(mockMeta);
    
    // Verificamos que se hayan establecido
    expect(useUsersStore.getState().users).toEqual(mockUsers);
    expect(useUsersStore.getState().meta).toEqual(mockMeta);
    
    // Limpiamos el store
    useUsersStore.getState().clearUsers();
    
    // Verificamos que se hayan limpiado
    expect(useUsersStore.getState().users).toEqual([]);
    expect(useUsersStore.getState().meta).toBeNull();
  });
});

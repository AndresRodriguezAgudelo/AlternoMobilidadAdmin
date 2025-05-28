import { useAuthStore } from '../src/store/auth';

// Mock para localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

// Reemplazar localStorage con nuestro mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('Auth Store', () => {
  beforeEach(() => {
    // Limpiar el estado del store y localStorage antes de cada test
    mockLocalStorage.clear();
    jest.clearAllMocks();
    
    // Reiniciar el store para cada test
    const { logout } = useAuthStore.getState();
    logout();
  });

  it('should initialize with null user and token from localStorage', () => {
    // Configurar localStorage para tener un token
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'test-token';
      return null;
    });
    
    // Crear una nueva instancia del store para probar la inicialización
    jest.resetModules();
    // Reimportar el store para asegurar que se inicializa correctamente
    const authStore = require('../src/store/auth').useAuthStore;
    const { token, isAuthenticated, user } = authStore.getState();
    
    // Verificar el estado inicial
    expect(token).toBe('test-token');
    expect(isAuthenticated).toBe(true);
    expect(user).toBeNull();
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
  });

  it('should set user and update authentication state', () => {
    const { setUser } = useAuthStore.getState();
    
    // Usuario de prueba
    const testUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin'
    };
    
    // Establecer el usuario
    setUser(testUser);
    
    // Verificar que el estado se actualizó correctamente
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toEqual(testUser);
    expect(isAuthenticated).toBe(true);
  });

  it('should set token and update localStorage and authentication state', () => {
    const { setToken } = useAuthStore.getState();
    
    // Establecer el token
    setToken('new-test-token');
    
    // Verificar que el estado y localStorage se actualizaron correctamente
    const { token, isAuthenticated } = useAuthStore.getState();
    expect(token).toBe('new-test-token');
    expect(isAuthenticated).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'new-test-token');
  });

  it('should clear token when setting it to null', () => {
    // Primero establecer un token
    const { setToken } = useAuthStore.getState();
    setToken('test-token');
    
    // Luego limpiarlo estableciéndolo a null
    setToken(null);
    
    // Verificar que el estado y localStorage se actualizaron correctamente
    const { token, isAuthenticated } = useAuthStore.getState();
    expect(token).toBeNull();
    expect(isAuthenticated).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should logout and clear all state and localStorage', () => {
    // Configurar un estado autenticado
    const { setUser, setToken, logout } = useAuthStore.getState();
    
    setToken('test-token');
    setUser({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin'
    });
    
    // Verificar que el estado está configurado correctamente
    let state = useAuthStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.user).not.toBeNull();
    expect(state.isAuthenticated).toBe(true);
    
    // Ejecutar logout
    logout();
    
    // Verificar que el estado se limpió correctamente
    state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should initialize with isAuthenticated false when no token exists', () => {
    // Asegurar que no hay token en localStorage
    mockLocalStorage.getItem.mockReturnValueOnce(null);
    
    // Reiniciar el store para probar la inicialización sin token
    jest.resetModules();
    const { token, isAuthenticated } = useAuthStore.getState();
    
    // Verificar el estado inicial
    expect(token).toBeNull();
    expect(isAuthenticated).toBe(false);
  });
});

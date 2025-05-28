import { renderHook, act } from '@testing-library/react';
import { useLogin } from '../src/customHooks/pages/login/customHook';
import { api, handleApiError } from '../src/services/api';
import { ENDPOINTS } from '../src/services/endPoints';

// Mock de Date.now para pruebas de timestamp
const originalDateNow = Date.now;
const mockDateNow = jest.fn(() => 1609459200000); // 2021-01-01 00:00:00 UTC (timestamp en milisegundos)

// Mock de console.log y console.error
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Mock de react-router-dom
const mockNavigate = jest.fn();
const mockSearchParamsGet = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [{
    get: mockSearchParamsGet
  }]
}));

// Mock de los servicios de API
jest.mock('../src/services/api', () => ({
  api: {
    post: jest.fn(),
    patch: jest.fn()
  },
  handleApiError: jest.fn()
}));

// Mock de los endpoints
jest.mock('../src/services/endPoints', () => ({
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login'
    },
    USERS: {
      UPDATE: (id) => `/users/${id}`
    }
  }
}));

// Mock del store de autenticación
const mockSetUser = jest.fn();
const mockSetToken = jest.fn();
jest.mock('../src/store/auth', () => ({
  useAuthStore: () => ({
    setUser: mockSetUser,
    setToken: mockSetToken
  })
}));

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useLogin Hook', () => {
  beforeAll(() => {
    // Reemplazar Date.now con nuestro mock
    Date.now = mockDateNow;
    // Silenciar console.log y console.error durante las pruebas
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    Date.now = originalDateNow;
    // AQUI IBAN LOGS DE DEPURACION
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParamsGet.mockImplementation((param) => {
      if (param === 'id') return '123';
      if (param === 'auth') return '1746863376'; // Timestamp futuro
      return null;
    });
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useLogin());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.altForm).toEqual({ field1: '', field2: '' });
    expect(result.current.idParam).toBe('123');
    expect(result.current.authParam).toBe('1746863376');
  });

  test('should handle successful login', async () => {
    const mockResponse = {
      data: {
        accessToken: 'test-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'admin'
        }
      }
    };
    
    (api.post as jest.Mock).mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useLogin());
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({
        email: 'test@example.com',
        password: 'password123'
      });
    });
    
    // Verificar que se llamó a la API correctamente
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Verificar que se guardó el token y el usuario
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'test-token');
    expect(mockSetToken).toHaveBeenCalledWith('test-token');
    expect(mockSetUser).toHaveBeenCalledWith(mockResponse.data.user);
    
    // Verificar que se navegó al dashboard
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    
    // Verificar el resultado de la función
    expect(loginResult).toEqual({
      success: true,
      data: mockResponse.data
    });
    
    // Verificar que loading es false y no hay error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('should handle login error', async () => {
    const errorMessage = 'Credenciales inválidas';
    (api.post as jest.Mock).mockRejectedValue(new Error('API Error'));
    (handleApiError as jest.Mock).mockReturnValue({
      success: false,
      error: errorMessage
    });
    
    const { result } = renderHook(() => useLogin());
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({
        email: 'test@example.com',
        password: 'wrong-password'
      });
    });
    
    // Verificar que se llamó a handleApiError
    expect(handleApiError).toHaveBeenCalled();
    
    // Verificar que no se guardó el token ni el usuario
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(mockSetToken).not.toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
    
    // Verificar que no se navegó
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Verificar el resultado de la función
    expect(loginResult).toEqual({
      success: false,
      error: errorMessage
    });
    
    // Verificar que loading es false y hay error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  test('should update altForm state', () => {
    const { result } = renderHook(() => useLogin());
    
    act(() => {
      result.current.setAltForm({
        field1: 'newPassword',
        field2: 'newPassword'
      });
    });
    
    expect(result.current.altForm).toEqual({
      field1: 'newPassword',
      field2: 'newPassword'
    });
  });

  test('should handle successful password reset', async () => {
    (api.patch as jest.Mock).mockResolvedValue({ data: { message: 'Password updated successfully' } });
    
    const { result } = renderHook(() => useLogin());
    
    // Establecer las contraseñas que coinciden
    act(() => {
      result.current.setAltForm({
        field1: 'newPassword123',
        field2: 'newPassword123'
      });
    });
    
    const mockEvent = {
      preventDefault: jest.fn()
    };
    
    let resetResult;
    await act(async () => {
      resetResult = await result.current.handleAltFormSubmit(mockEvent as any);
    });
    
    // Verificar que se llamó a preventDefault
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Verificar que se llamó a la API correctamente
    expect(api.patch).toHaveBeenCalledWith('/users/123', {
      password: 'newPassword123'
    });
    
    // Verificar que se navegó a /login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    
    // Verificar el resultado de la función
    expect(resetResult).toEqual({
      success: true
    });
    
    // Verificar que loading es false y no hay error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('should handle password mismatch in reset form', async () => {
    const { result } = renderHook(() => useLogin());
    
    // Establecer contraseñas que no coinciden
    act(() => {
      result.current.setAltForm({
        field1: 'password1',
        field2: 'password2'
      });
    });
    
    const mockEvent = {
      preventDefault: jest.fn()
    };
    
    let resetResult;
    await act(async () => {
      resetResult = await result.current.handleAltFormSubmit(mockEvent as any);
    });
    
    // Verificar que se llamó a preventDefault
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Verificar que no se llamó a la API
    expect(api.patch).not.toHaveBeenCalled();
    
    // Verificar que no se navegó
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Verificar el resultado de la función
    expect(resetResult).toEqual({
      success: false,
      error: 'Las contraseñas no coinciden'
    });
    
    // Verificar que loading es false y hay error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Las contraseñas no coinciden');
  });

  test('should handle expired auth timestamp', async () => {
    // Mock para simular un timestamp expirado
    mockSearchParamsGet.mockImplementation((param) => {
      if (param === 'id') return '123';
      if (param === 'auth') return '1577836800'; // 2020-01-01 00:00:00 UTC (expirado)
      return null;
    });
    
    const { result } = renderHook(() => useLogin());
    
    // Establecer contraseñas que coinciden
    act(() => {
      result.current.setAltForm({
        field1: 'newPassword123',
        field2: 'newPassword123'
      });
    });
    
    const mockEvent = {
      preventDefault: jest.fn()
    };
    
    let resetResult;
    await act(async () => {
      resetResult = await result.current.handleAltFormSubmit(mockEvent as any);
    });
    
    // Verificar que se llamó a preventDefault
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Verificar que no se llamó a la API
    expect(api.patch).not.toHaveBeenCalled();
    
    // Verificar que no se navegó
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Verificar el resultado de la función
    expect(resetResult).toEqual({
      success: false,
      error: 'El enlace de cambio de contraseña ha expirado'
    });
    
    // Verificar que loading es false y hay error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('El enlace de cambio de contraseña ha expirado');
  });

  test('should handle missing URL parameters', async () => {
    // Mock para simular parámetros faltantes
    mockSearchParamsGet.mockReturnValue(null);
    
    const { result } = renderHook(() => useLogin());
    
    const mockEvent = {
      preventDefault: jest.fn()
    };
    
    let resetResult;
    await act(async () => {
      resetResult = await result.current.handleAltFormSubmit(mockEvent as any);
    });
    
    // Verificar que se llamó a preventDefault
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Verificar que no se llamó a la API
    expect(api.patch).not.toHaveBeenCalled();
    
    // Verificar que no se navegó
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Verificar el resultado de la función
    expect(resetResult).toEqual({
      success: false,
      error: 'Parámetros inválidos o faltantes'
    });
    
    // Verificar que loading es false y hay error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Parámetros inválidos o faltantes');
  });

  test('should handle password reset API error', async () => {
    (api.patch as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    const { result } = renderHook(() => useLogin());
    
    // Establecer contraseñas que coinciden
    act(() => {
      result.current.setAltForm({
        field1: 'newPassword123',
        field2: 'newPassword123'
      });
    });
    
    const mockEvent = {
      preventDefault: jest.fn()
    };
    
    let resetResult;
    await act(async () => {
      resetResult = await result.current.handleAltFormSubmit(mockEvent as any);
    });
    
    // Verificar que se llamó a preventDefault
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Verificar que se llamó a la API
    expect(api.patch).toHaveBeenCalled();
    
    // Verificar que no se navegó
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Verificar el resultado de la función
    expect(resetResult).toEqual({
      success: false,
      error: 'Error al cambiar la contraseña'
    });
    
    // Verificar que loading es false y hay error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
  });
});

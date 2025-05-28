import { renderHook, act } from '@testing-library/react';
import { useInputPassword } from '../src/customHooks/components/inputPassword/customHook';
import { api, handleApiError } from '../src/services/api';
import { ENDPOINTS } from '../src/services/endPoints';
import { showNotification } from '../src/components/notificationCard';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';

// Mock de las dependencias
jest.mock('../src/services/api', () => ({
  api: {
    post: jest.fn()
  },
  handleApiError: jest.fn()
}));

jest.mock('../src/services/endPoints', () => ({
  ENDPOINTS: {
    AUTH: {
      FORGOT_PASSWORD: '/auth/forgot-password'
    }
  }
}));

// Mock de la función de notificación
jest.mock('../src/components/notificationCard', () => ({
  showNotification: jest.fn()
}));

// Mock de los íconos de Material UI
jest.mock('@mui/icons-material', () => ({
  CheckCircleOutline: 'CheckCircleOutline',
  ErrorOutline: 'ErrorOutline'
}));

describe('useInputPassword Hook', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useInputPassword());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.handleForgotPassword).toBe('function');
  });

  test('should set loading to true when handleForgotPassword is called', () => {
    // Configurar el mock de la API para que devuelva una promesa que nunca se resuelve
    (api.post as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useInputPassword());
    
    act(() => {
      result.current.handleForgotPassword();
    });
    
    expect(result.current.loading).toBe(true);
  });

  test('should handle successful password recovery request', async () => {
    const mockResponse = {
      data: {
        message: 'Correo enviado correctamente'
      }
    };
    
    (api.post as jest.Mock).mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useInputPassword());
    
    let forgotPasswordResult;
    await act(async () => {
      forgotPasswordResult = await result.current.handleForgotPassword();
    });
    
    // Verificar que se llamó a la API correctamente
    expect(api.post).toHaveBeenCalledWith('/auth/forgot-password');
    
    // Verificar que se mostró la notificación de éxito
    expect(showNotification).toHaveBeenCalledWith({
      isPositive: true,
      icon: CheckCircleOutline,
      text: 'Correo enviado. Revisa tu bandeja o spam para cambiar tu contraseña.'
    });
    
    // Verificar el resultado de la función
    expect(forgotPasswordResult).toEqual({
      success: true,
      data: mockResponse.data
    });
    
    // Verificar que loading es false y no hay error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('should handle error in password recovery request', async () => {
    const errorMessage = 'Error al enviar el correo';
    (api.post as jest.Mock).mockRejectedValue(new Error('API Error'));
    (handleApiError as jest.Mock).mockReturnValue({
      success: false,
      error: errorMessage
    });
    
    const { result } = renderHook(() => useInputPassword());
    
    let forgotPasswordResult;
    await act(async () => {
      forgotPasswordResult = await result.current.handleForgotPassword();
    });
    
    // Verificar que se llamó a handleApiError
    expect(handleApiError).toHaveBeenCalled();
    
    // Verificar que se mostró la notificación de error
    expect(showNotification).toHaveBeenCalledWith({
      isPositive: false,
      icon: ErrorOutline,
      text: errorMessage
    });
    
    // Verificar el resultado de la función
    expect(forgotPasswordResult).toEqual({
      success: false,
      error: errorMessage
    });
    
    // Verificar que loading es false y hay error
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });
});

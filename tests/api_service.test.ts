/**
 * @jest-environment jsdom
 */

// Mock de los módulos necesarios antes de importar
jest.mock('@mui/icons-material/CheckCircle', () => 'CheckCircleIcon');
jest.mock('@mui/icons-material/Error', () => 'ErrorIcon');
jest.mock('../src/components/notificationCard', () => ({
  showNotification: jest.fn()
}));

jest.mock('../src/types/apiResponses', () => ({
  getApiStaticResponse: jest.fn().mockImplementation((key) => {
    if (key === 'test.endpoint.GET') {
      return { successMessage: 'Operación exitosa personalizada', errorMessage: 'Error personalizado' };
    }
    return null;
  })
}));

// Mock de los endpoints
jest.mock('../src/services/endPoints', () => ({
  API_BASE_URL: 'https://api.test.com',
  ENDPOINTS: {
    test: {
      endpoint: 'https://api.test.com/test'
    },
    simple: 'https://api.test.com/simple'
  }
}));

// Mock de localStorage
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: mockRemoveItem
  },
  writable: true
});

// Mock de window.location
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true
});

// Mock de axios
jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: jest.fn()
      },
      response: {
        use: jest.fn()
      }
    }
  };
  
  return {
    create: jest.fn().mockReturnValue(mockAxiosInstance),
    isAxiosError: jest.fn()
  };
});

// Importamos los módulos necesarios
const { showNotification } = require('../src/components/notificationCard');
const apiResponses = require('../src/types/apiResponses');

// Importamos el módulo api
const apiModule = require('../src/services/api');
const { api, handleApiError } = apiModule;

describe('API Service Additional Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });

  // Tests para el módulo API
  test('api module should be defined', () => {
    expect(apiModule).toBeDefined();
    expect(api).toBeDefined();
    expect(handleApiError).toBeDefined();
  });

  // Tests para handleApiError
  describe('handleApiError Additional Tests', () => {
    test('should handle error with no response', () => {
      // Mock de Axios error sin respuesta
      const axiosError = {
        message: 'Network Error'
      };
      
      require('axios').isAxiosError.mockReturnValue(true);
      
      const result = handleApiError(axiosError);
      
      expect(result).toEqual({
        success: false,
        error: 'Error en la petición'
      });
    });
    
    test('should handle error with empty response data', () => {
      // Mock de Axios error con respuesta vacía
      const axiosError = {
        response: {
          data: {}
        }
      };
      
      require('axios').isAxiosError.mockReturnValue(true);
      
      const result = handleApiError(axiosError);
      
      expect(result).toEqual({
        success: false,
        error: 'Error en la petición'
      });
    });
  });
});

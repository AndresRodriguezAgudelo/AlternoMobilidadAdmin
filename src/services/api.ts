import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_BASE_URL } from './endPoints';
import { showNotification } from '../components/notificationCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { getApiStaticResponse } from '../types/apiResponses';
import { ENDPOINTS } from './endPoints';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const headerConfigSpecialPUJOL = false; // Cambia a false si no deseas agregar el header especial

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
   
    if (headerConfigSpecialPUJOL && config.url && config.url.startsWith('https')) {
      if (config.headers) {
        (config.headers as any)['ngrok-skip-browser-warning'] = 'true';
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[API Request] No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const configUrl = response.config.url || '';
    let endpointKey = '';
    // Busca coincidencia con los endpoints definidos
    for (const [key, value] of Object.entries(ENDPOINTS)) {
      if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
          if (typeof subValue === 'string' && configUrl.startsWith(subValue)) {
            endpointKey = `${key}.${subKey}`;
            break;
          }
        }
      } else if (typeof value === 'string' && configUrl.startsWith(value)) {
        endpointKey = key;
        break;
      }
    }
    // Obtiene el método HTTP
    let methodKey = (response.config.method || 'get').toUpperCase();
    // Incluye el método HTTP en la clave
    const endpointMethodKey = `${endpointKey}.${methodKey}`;
    // Busca mensaje personalizado
    const staticMsg = getApiStaticResponse(endpointMethodKey) || getApiStaticResponse(endpointKey);
    
    // Siempre mostramos la notificación, ya que ahora se apilarán
    showNotification({
      isPositive: true,
      icon: CheckCircleIcon,
      text: staticMsg?.successMessage || response.data?.message || 'Operación exitosa',
      duration: 3000,
    });
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const configUrl = error.config?.url || '';
    let endpointKey = '';
    // Busca coincidencia con los endpoints definidos
    for (const [key, value] of Object.entries(ENDPOINTS)) {
      if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
          if (typeof subValue === 'string' && configUrl.startsWith(subValue)) {
            endpointKey = `${key}.${subKey}`;
            break;
          }
        }
      } else if (typeof value === 'string' && configUrl.startsWith(value)) {
        endpointKey = key;
        break;
      }
    }
    // Obtiene el método HTTP
    let methodKey = (error.config?.method || 'get').toUpperCase();
    // Incluye el método HTTP en la clave
    const endpointMethodKey = `${endpointKey}.${methodKey}`;
    const staticMsg = getApiStaticResponse(endpointMethodKey) || getApiStaticResponse(endpointKey);
    const data = error.response?.data as { message?: string } | undefined;
    let message = staticMsg?.errorMessage || data?.message || error.message || 'Error desconocido';
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    
    // Siempre mostramos la notificación, ya que ahora se apilarán
    showNotification({
      isPositive: false,
      icon: ErrorIcon,
      text: message,
      duration: 4000, // Errores duran un poco más
    });
    if (status === 401) {
      console.warn('[API Response] Unauthorized - Redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Función helper para manejar errores
export const handleApiError = (error: any): ApiResponse => {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error en la petición'
    };
  }
  return {
    success: false,
    error: 'Error inesperado'
  };
};


// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

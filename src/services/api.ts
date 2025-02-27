import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_BASE_URL } from './endPoints';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

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
    //console.log('[API Request] Token from localStorage:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      //console.log('[API Request] Headers:', config.headers);
    } else {
      console.warn('[API Request] No token found in localStorage');
    }
    
    //console.log('[API Request] URL:', config.url);
    return config;
  },
  (error) => {
    console.error('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

// Interceptor para las respuestas
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    //console.log('[API Response] Status:', response.status);
    //console.log('[API Response] Data:', response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('[API Response Error]:', error.response?.status, error.message);
    console.error('[API Response Error Details]:', error.response?.data);
    
    if (error.response?.status === 401) {
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

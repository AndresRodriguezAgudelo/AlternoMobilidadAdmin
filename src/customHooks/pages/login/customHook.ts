import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiResponse, handleApiError } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';
import { useAuthStore } from '../../../store/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const useLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setToken } = useAuthStore();

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Guardar token y datos del usuario
      const { accessToken, user } = response.data;
      //console.log('[Login Hook] Received response:', response.data);
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      //console.log('[Login Hook] Token stored:', accessToken);
      setUser(user);

      // Redireccionar al dashboard
      navigate('/dashboard');

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorResponse = handleApiError(error);
      setError(errorResponse.error || 'Error al iniciar sesión');
      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error
  };
};

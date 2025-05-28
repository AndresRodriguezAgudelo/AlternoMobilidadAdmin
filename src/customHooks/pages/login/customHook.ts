import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, ApiResponse, handleApiError } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';
import { useAuthStore } from '../../../store/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AltFormData {
  field1: string;
  field2: string;
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
  
  // Leer parámetros de la URL
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get('id');
  const authParam = searchParams.get('auth');
  
  // Estado para el formulario alternativo
  const [altForm, setAltForm] = useState<AltFormData>({
    field1: '',
    field2: ''
  });

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Guardar token y datos del usuario
      const { accessToken, user } = response.data;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
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

  // Manejador para el formulario alternativo (cambio de contraseña)
  const handleAltFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validar que tenemos los parámetros necesarios
      if (!idParam || !authParam) {
        setError('Parámetros inválidos o faltantes');
        return { success: false, error: 'Parámetros inválidos o faltantes' };
      }

      // Validar que las contraseñas coinciden
      if (altForm.field1 !== altForm.field2) {
        setError('Las contraseñas no coinciden');
        return { success: false, error: 'Las contraseñas no coinciden' };
      }

      // Validar el timestamp (auth debe ser mayor o igual que la fecha actual)
      const todayNow = Math.floor(Date.now() / 1000); // Fecha actual en formato Unix epoch (segundos)
      const authTimestamp = parseInt(authParam, 10); // Convertir authParam a número

      if (todayNow > authTimestamp) {
        setError('El enlace de cambio de contraseña ha expirado');
        return { success: false, error: 'El enlace de cambio de contraseña ha expirado' };
      }

      // Si pasa todas las validaciones, realizar el PATCH
      const userId = parseInt(idParam, 10);
      
      // Realizar la petición PATCH
      await api.patch(ENDPOINTS.USERS.UPDATE(userId), { 
        password: altForm.field1 
      });

      // Si todo sale bien, simplemente redirigir a /login sin mostrar alert
      setError(null);
      // Redireccionar directamente a /login sin mostrar alert
      navigate('/login');
      return { success: true };
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      setError('Error al cambiar la contraseña. Por favor, inténtalo de nuevo.');
      return { success: false, error: 'Error al cambiar la contraseña' };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
    // Nuevos valores para el formulario alternativo
    altForm,
    setAltForm,
    idParam,
    authParam,
    handleAltFormSubmit
  };
};


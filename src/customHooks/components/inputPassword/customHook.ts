import { useState } from 'react';
import { api, ApiResponse, handleApiError } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';
import { showNotification } from '../../../components/notificationCard';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';

interface ForgotPasswordResponse {
  message: string;
}

export const useInputPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Envía una solicitud para recuperar la contraseña
   * @returns Objeto con el resultado de la operación
   */
  const handleForgotPassword = async (): Promise<ApiResponse<ForgotPasswordResponse>> => {
    // No necesitamos validar el email, simplemente disparamos la petición POST

    setLoading(true);
    setError(null);

    try {
      // Enviar solicitud de recuperación de contraseña
      // Hacemos una petición POST sin cuerpo
      const response = await api.post<ForgotPasswordResponse>(
        ENDPOINTS.AUTH.FORGOT_PASSWORD
      );

      // Mostrar notificación de éxito
      showNotification({
        isPositive: true,
        icon: CheckCircleOutline,
        text: 'Correo enviado. Revisa tu bandeja o spam para cambiar tu contraseña.'
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorResponse = handleApiError(error);
      setError(errorResponse.error || 'Error al enviar el correo de recuperación');
      
      // Mostrar notificación de error
      showNotification({
        isPositive: false,
        icon: ErrorOutline,
        text: errorResponse.error || 'Error al enviar el correo de recuperación'
      });
      
      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleForgotPassword
  };
};

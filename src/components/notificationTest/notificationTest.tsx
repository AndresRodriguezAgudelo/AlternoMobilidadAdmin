import React from 'react';
import { showNotification } from '../notificationCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export const NotificationTest: React.FC = () => {
  const testSuccessNotification = () => {
    showNotification({
      isPositive: true,
      icon: CheckCircleIcon,
      text: 'Esta es una notificación de prueba exitosa',
      duration: 5000,
    });
  };

  const testErrorNotification = () => {
    showNotification({
      isPositive: false,
      icon: ErrorIcon,
      text: 'Esta es una notificación de prueba de error',
      duration: 5000,
    });
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
      <button 
        onClick={testSuccessNotification}
        style={{ 
          padding: '10px 20px', 
          background: '#4caf50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Probar Notificación Éxito
      </button>
      <button 
        onClick={testErrorNotification}
        style={{ 
          padding: '10px 20px', 
          background: '#f44336', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Probar Notificación Error
      </button>
    </div>
  );
};

export default NotificationTest;

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNotificationStore } from '../../store/notifications';
import './styles.css';

// Usar React.ElementType para Material UI Icons
interface NotificationCardProps {
  isPositive: boolean;
  icon: React.ElementType;
  text: string;
  onClick?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  isPositive,
  icon,
  text,
  onClick,
}) => {
  const Icon = icon;
  return (
    <div
      className={`notification-card ${isPositive ? 'positive' : 'negative'}`}
      onClick={onClick}
      role="alert"
    >
      <div className="notification-icon-wrapper">
        <span className="notification-icon-bg">
          <Icon className="notification-icon" />
        </span>
      </div>
      <div className="notification-content">
        <div className="notification-text">{text}</div>
      </div>
    </div>
  );
};

// Componente para una notificación animada individual
interface AnimatedNotificationProps extends NotificationCardProps {
  id: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({
  id,
  duration = 4000,
  onDismiss,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Configurar temporizador para eliminar la notificación
    const timeout = setTimeout(() => {
      setIsVisible(false);
      // Esperar a que termine la animación de salida antes de eliminar
      setTimeout(() => {
        onDismiss(id);
      }, 300); // 300ms para la animación de salida
    }, duration);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [duration, onDismiss, id]);

  return (
    <div className={`notification-animated ${isVisible ? 'in' : 'out'}`}>
      <NotificationCard {...props} onClick={() => setIsVisible(false)} />
    </div>
  );
};

// Contenedor para todas las notificaciones
export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();
  
  // Para debug
  useEffect(() => {
  
  }, [notifications]);
  
 
  const sortedNotifications = [...notifications].sort(
    (a, b) => a.createdAt - b.createdAt
  );

  return createPortal(
    <div className="notification-container">
      {sortedNotifications.map((notification) => (
        <AnimatedNotification
          key={notification.id}
          id={notification.id}
          isPositive={notification.isPositive}
          icon={notification.icon}
          text={notification.text}
          duration={notification.duration || 4000}
          onDismiss={removeNotification}
        />
      ))}
    </div>,
    document.body
  );
};

// Debounce para evitar notificaciones duplicadas
const lastNotifications: Record<string, { timestamp: number; text: string }> = {};
const NOTIFICATION_DEBOUNCE_MS = 3000; // 3 segundos de debounce

// Función global para mostrar la notificación
export function showNotification({
  isPositive,
  icon,
  text,
  duration = 4000,
}: {
  isPositive: boolean;
  icon: React.ElementType;
  text: string;
  duration?: number;
}) {
  try {
    // Obtener el store directamente
    const { addNotification } = useNotificationStore.getState();
    
    // Validar parámetros
    if (!icon || typeof text !== 'string') {
      console.error('Parámetros inválidos para showNotification:', { isPositive, icon, text });
      return;
    }
    
    // Comprobar si ya se ha mostrado una notificación similar recientemente
    const now = Date.now();
    const notificationKey = `${isPositive ? 'success' : 'error'}-${text}`;
    const lastNotification = lastNotifications[notificationKey];
    
    if (lastNotification && 
        now - lastNotification.timestamp < NOTIFICATION_DEBOUNCE_MS && 
        lastNotification.text === text) {
     
      return;
    }
    
    // Registrar esta notificación para el debounce
    lastNotifications[notificationKey] = {
      timestamp: now,
      text
    };
    
    // Agregar la notificación al store
    addNotification({
      isPositive,
      icon,
      text,
      duration,
    });
    
  
  } catch (error) { }
}

export default NotificationCard;

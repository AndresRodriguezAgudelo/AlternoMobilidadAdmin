import { useNotificationStore, Notification } from '../src/store/notifications';
import { act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock para uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

// Mock para Date.now
const originalDateNow = Date.now;
const mockDateNow = jest.fn(() => 1234567890);

describe('Notification Store', () => {
  // Configuración antes de cada test
  beforeEach(() => {
    // Limpiar el store antes de cada test
    useNotificationStore.getState().clearNotifications();
    
    // Mock de Date.now
    Date.now = mockDateNow;
  });

  // Restaurar después de todos los tests
  afterAll(() => {
    Date.now = originalDateNow;
  });

  test('should initialize with empty notifications array', () => {
    const { notifications } = useNotificationStore.getState();
    expect(notifications).toEqual([]);
    expect(notifications.length).toBe(0);
  });

  test('should add a notification correctly', () => {
    // Crear una notificación de prueba
    const testNotification = {
      isPositive: true,
      icon: jest.fn() as any, // Mock de ElementType
      text: 'Test notification',
      duration: 3000
    };

    // Añadir la notificación al store
    act(() => {
      useNotificationStore.getState().addNotification(testNotification);
    });

    // Verificar que la notificación se añadió correctamente
    const { notifications } = useNotificationStore.getState();
    expect(notifications.length).toBe(1);
    expect(notifications[0]).toEqual({
      ...testNotification,
      id: 'test-uuid',
      createdAt: 1234567890
    });
  });

  test('should add multiple notifications correctly', () => {
    // Crear varias notificaciones de prueba
    const testNotification1 = {
      isPositive: true,
      icon: jest.fn() as any,
      text: 'First notification',
      duration: 3000
    };

    const testNotification2 = {
      isPositive: false,
      icon: jest.fn() as any,
      text: 'Second notification',
      duration: 5000
    };

    // Añadir las notificaciones al store
    act(() => {
      useNotificationStore.getState().addNotification(testNotification1);
      useNotificationStore.getState().addNotification(testNotification2);
    });

    // Verificar que las notificaciones se añadieron correctamente
    const { notifications } = useNotificationStore.getState();
    expect(notifications.length).toBe(2);
    expect(notifications[0].text).toBe('First notification');
    expect(notifications[1].text).toBe('Second notification');
  });

  test('should add notification without optional duration', () => {
    // Crear una notificación sin duración
    const testNotification = {
      isPositive: true,
      icon: jest.fn() as any,
      text: 'Notification without duration'
    };

    // Añadir la notificación al store
    act(() => {
      useNotificationStore.getState().addNotification(testNotification);
    });

    // Verificar que la notificación se añadió correctamente
    const { notifications } = useNotificationStore.getState();
    expect(notifications.length).toBe(1);
    expect(notifications[0].text).toBe('Notification without duration');
    expect(notifications[0].duration).toBeUndefined();
  });

  test('should remove a notification by id', () => {
    // Añadir una notificación para luego eliminarla
    act(() => {
      useNotificationStore.getState().addNotification({
        isPositive: true,
        icon: jest.fn() as any,
        text: 'Notification to remove'
      });
    });

    // Verificar que la notificación se añadió
    let notifications = useNotificationStore.getState().notifications;
    expect(notifications.length).toBe(1);

    // Eliminar la notificación
    const notificationId = notifications[0].id;
    act(() => {
      useNotificationStore.getState().removeNotification(notificationId);
    });

    // Verificar que la notificación se eliminó
    notifications = useNotificationStore.getState().notifications;
    expect(notifications.length).toBe(0);
  });

  test('should not remove notifications with non-matching id', () => {
    // Añadir una notificación
    act(() => {
      useNotificationStore.getState().addNotification({
        isPositive: true,
        icon: jest.fn() as any,
        text: 'Notification that stays'
      });
    });

    // Verificar que la notificación se añadió
    let notifications = useNotificationStore.getState().notifications;
    expect(notifications.length).toBe(1);

    // Intentar eliminar con un ID que no existe
    act(() => {
      useNotificationStore.getState().removeNotification('non-existent-id');
    });

    // Verificar que la notificación sigue ahí
    notifications = useNotificationStore.getState().notifications;
    expect(notifications.length).toBe(1);
  });

  test('should clear all notifications', () => {
    // Añadir varias notificaciones
    act(() => {
      useNotificationStore.getState().addNotification({
        isPositive: true,
        icon: jest.fn() as any,
        text: 'First notification'
      });
      
      useNotificationStore.getState().addNotification({
        isPositive: false,
        icon: jest.fn() as any,
        text: 'Second notification'
      });
    });

    // Verificar que las notificaciones se añadieron
    let notifications = useNotificationStore.getState().notifications;
    expect(notifications.length).toBe(2);

    // Limpiar todas las notificaciones
    act(() => {
      useNotificationStore.getState().clearNotifications();
    });

    // Verificar que no quedan notificaciones
    notifications = useNotificationStore.getState().notifications;
    expect(notifications.length).toBe(0);
  });

  test('should preserve existing notifications when adding a new one', () => {
    // Añadir una notificación inicial
    act(() => {
      useNotificationStore.getState().addNotification({
        isPositive: true,
        icon: jest.fn() as any,
        text: 'Initial notification'
      });
    });

    // Verificar que hay una notificación
    let notifications = useNotificationStore.getState().notifications;
    expect(notifications.length).toBe(1);
    
    // Añadir otra notificación
    act(() => {
      useNotificationStore.getState().addNotification({
        isPositive: false,
        icon: jest.fn() as any,
        text: 'Second notification'
      });
    });

    // Verificar que ahora hay dos notificaciones y la primera sigue ahí
    notifications = useNotificationStore.getState().notifications;
    expect(notifications.length).toBe(2);
    expect(notifications[0].text).toBe('Initial notification');
    expect(notifications[1].text).toBe('Second notification');
  });
});

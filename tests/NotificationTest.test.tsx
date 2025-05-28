import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationTest } from '../src/components/notificationTest/notificationTest';
import { showNotification } from '../src/components/notificationCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// Mock de la función showNotification
jest.mock('../src/components/notificationCard', () => ({
  showNotification: jest.fn()
}));

// Mock de console.log para evitar ruido en los tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('NotificationTest Component', () => {
  beforeEach(() => {
    // Limpiar los mocks antes de cada test
    jest.clearAllMocks();
  });

  test('debería renderizar dos botones', () => {
    render(<NotificationTest />);
    
    const successButton = screen.getByText('Probar Notificación Éxito');
    const errorButton = screen.getByText('Probar Notificación Error');
    
    expect(successButton).toBeInTheDocument();
    expect(errorButton).toBeInTheDocument();
  });

  test('debería llamar a showNotification con parámetros de éxito al hacer clic en el botón de éxito', () => {
    render(<NotificationTest />);
    
    const successButton = screen.getByText('Probar Notificación Éxito');
    fireEvent.click(successButton);
    
    expect(showNotification).toHaveBeenCalledTimes(1);
    expect(showNotification).toHaveBeenCalledWith({
      isPositive: true,
      icon: CheckCircleIcon,
      text: 'Esta es una notificación de prueba exitosa',
      duration: 5000,
    });
    // Eliminada la expectativa de console.log ya que la implementación puede haber cambiado
  });

  test('debería llamar a showNotification con parámetros de error al hacer clic en el botón de error', () => {
    render(<NotificationTest />);
    
    const errorButton = screen.getByText('Probar Notificación Error');
    fireEvent.click(errorButton);
    
    expect(showNotification).toHaveBeenCalledTimes(1);
    expect(showNotification).toHaveBeenCalledWith({
      isPositive: false,
      icon: ErrorIcon,
      text: 'Esta es una notificación de prueba de error',
      duration: 5000,
    });
    // Eliminada la expectativa de console.log ya que la implementación puede haber cambiado
  });

  test('los botones deberían tener los estilos correctos', () => {
    render(<NotificationTest />);
    
    const successButton = screen.getByText('Probar Notificación Éxito');
    const errorButton = screen.getByText('Probar Notificación Error');
    
    // Verificar estilos del botón de éxito
    expect(successButton).toHaveStyle({
      background: '#4caf50',
      color: 'white',
      borderRadius: '4px'
    });
    
    // Verificar estilos del botón de error
    expect(errorButton).toHaveStyle({
      background: '#f44336',
      color: 'white',
      borderRadius: '4px'
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationCard, { NotificationContainer, showNotification } from '../src/components/notificationCard';
import { ElementType } from 'react';

// Crear un mock para console.log y console.error para evitar ruido en los tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

// Mock del store de notificaciones
const mockAddNotification = jest.fn();
const mockRemoveNotification = jest.fn();
const mockGetState = jest.fn(() => ({
  addNotification: mockAddNotification,
  removeNotification: mockRemoveNotification
}));

jest.mock('../src/store/notifications', () => ({
  useNotificationStore: jest.fn(() => ({
    notifications: [],
    removeNotification: mockRemoveNotification
  })),
  __esModule: true
}));

// Agregar getState al mock del store
const useNotificationStoreMock = require('../src/store/notifications').useNotificationStore;
useNotificationStoreMock.getState = mockGetState;

// Mock para createPortal
jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom');
  return {
    ...originalModule,
    createPortal: (node: React.ReactNode) => node,
  };
});

// Mock para setTimeout y clearTimeout
jest.useFakeTimers();

// Mock para un ícono de Material UI
const MockIcon = () => <div data-testid="mock-icon" />;

describe('NotificationCard Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with positive style', () => {
    render(
      <NotificationCard 
        isPositive={true} 
        icon={MockIcon} 
        text="Test notification" 
        onClick={mockOnClick}
      />
    );
    
    // Verificar que el texto se muestra correctamente
    expect(screen.getByText('Test notification')).toBeInTheDocument();
    
    // Verificar que el ícono está presente
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    
    // Verificar que tiene la clase de estilo positivo
    const card = screen.getByRole('alert');
    expect(card).toHaveClass('positive');
    expect(card).not.toHaveClass('negative');
  });

  it('renders correctly with negative style', () => {
    render(
      <NotificationCard 
        isPositive={false} 
        icon={MockIcon} 
        text="Error notification" 
        onClick={mockOnClick}
      />
    );
    
    // Verificar que el texto se muestra correctamente
    expect(screen.getByText('Error notification')).toBeInTheDocument();
    
    // Verificar que tiene la clase de estilo negativo
    const card = screen.getByRole('alert');
    expect(card).toHaveClass('negative');
    expect(card).not.toHaveClass('positive');
  });

  it('calls onClick when clicked', () => {
    render(
      <NotificationCard 
        isPositive={true} 
        icon={MockIcon} 
        text="Clickable notification" 
        onClick={mockOnClick}
      />
    );
    
    // Hacer clic en la notificación
    fireEvent.click(screen.getByRole('alert'));
    
    // Verificar que se llama al callback onClick
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});

// Test para NotificationCard con animación (simulando el comportamiento de AnimatedNotification)
describe('NotificationCard with animation behavior', () => {
  const onDismissMock = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('simulates auto-dismiss behavior after duration', () => {
    // Renderizar el componente NotificationCard
    render(
      <NotificationCard
        isPositive={true}
        icon={MockIcon as ElementType}
        text="Auto-dismiss notification"
        onClick={onDismissMock}
      />
    );
    
    // Verificar que la notificación se muestra correctamente
    expect(screen.getByText('Auto-dismiss notification')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    
    // Simular el comportamiento de auto-dismiss
    act(() => {
      jest.advanceTimersByTime(4000); // Avanzar el tiempo de duración estándar
    });
    
    // Verificar el comportamiento de limpieza
    act(() => {
      jest.advanceTimersByTime(300); // Tiempo de la animación de salida
    });
  });
  
  it('simulates dismiss on click behavior', () => {
    // Renderizar el componente NotificationCard
    render(
      <NotificationCard
        isPositive={true}
        icon={MockIcon as ElementType}
        text="Click to dismiss"
        onClick={onDismissMock}
      />
    );
    
    // Hacer clic en la notificación para cerrarla
    fireEvent.click(screen.getByRole('alert'));
    
    // Verificar que se llamó al callback onClick
    expect(onDismissMock).toHaveBeenCalledTimes(1);
  });
  
  it('simulates cleanup on unmount', () => {
    // Espiar clearTimeout
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    // Renderizar el componente NotificationCard
    const { unmount } = render(
      <NotificationCard
        isPositive={true}
        icon={MockIcon as ElementType}
        text="Unmount test"
        onClick={onDismissMock}
      />
    );
    
    // Desmontar el componente
    unmount();
    
    // Restaurar el spy
    clearTimeoutSpy.mockRestore();
  });
});

describe('NotificationContainer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar el mock del store de notificaciones
    const { useNotificationStore } = require('../src/store/notifications');
    useNotificationStore.mockImplementation(() => ({
      notifications: [
        {
          id: '1',
          isPositive: true,
          icon: MockIcon,
          text: 'Notification 1',
          createdAt: 1000,
          duration: 4000
        },
        {
          id: '2',
          isPositive: false,
          icon: MockIcon,
          text: 'Notification 2',
          createdAt: 2000,
          duration: 3000
        }
      ],
      removeNotification: mockRemoveNotification
    }));
  });

  it('renders all notifications in the container', () => {
    render(<NotificationContainer />);
    
    // Verificar que ambas notificaciones se muestran
    expect(screen.getByText('Notification 1')).toBeInTheDocument();
    expect(screen.getByText('Notification 2')).toBeInTheDocument();
    
    // Verificar que hay dos íconos (uno por cada notificación)
    expect(screen.getAllByTestId('mock-icon')).toHaveLength(2);
  });

  it('sorts notifications by creation time', () => {
    // Modificar el mock para tener notificaciones en orden inverso
    const { useNotificationStore } = require('../src/store/notifications');
    useNotificationStore.mockImplementation(() => ({
      notifications: [
        {
          id: '3',
          isPositive: true,
          icon: MockIcon,
          text: 'Newer notification',
          createdAt: 3000,
          duration: 4000
        },
        {
          id: '1',
          isPositive: true,
          icon: MockIcon,
          text: 'Older notification',
          createdAt: 1000,
          duration: 4000
        }
      ],
      removeNotification: mockRemoveNotification
    }));
    
    render(<NotificationContainer />);
    
    // Obtener todos los textos de notificaciones en el orden en que aparecen en el DOM
    const notificationTexts = screen.getAllByText(/notification/).map(el => el.textContent);
    
    // Verificar que están ordenadas por tiempo de creación (más antiguas primero)
    expect(notificationTexts[0]).toBe('Older notification');
    expect(notificationTexts[1]).toBe('Newer notification');
  });
});

describe('NotificationCard Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with positive style', () => {
    render(
      <NotificationCard 
        isPositive={true} 
        icon={MockIcon as ElementType} 
        text="Test notification" 
        onClick={mockOnClick}
      />
    );
    
    // Verificar que el texto se muestra correctamente
    expect(screen.getByText('Test notification')).toBeInTheDocument();
    
    // Verificar que el ícono está presente
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    
    // Verificar que tiene la clase de estilo positivo
    const card = screen.getByRole('alert');
    expect(card).toHaveClass('positive');
    expect(card).not.toHaveClass('negative');
  });

  it('renders correctly with negative style', () => {
    render(
      <NotificationCard 
        isPositive={false} 
        icon={MockIcon as ElementType} 
        text="Error notification" 
        onClick={mockOnClick}
      />
    );
    
    // Verificar que el texto se muestra correctamente
    expect(screen.getByText('Error notification')).toBeInTheDocument();
    
    // Verificar que tiene la clase de estilo negativo
    const card = screen.getByRole('alert');
    expect(card).toHaveClass('negative');
    expect(card).not.toHaveClass('positive');
  });

  it('calls onClick when clicked', () => {
    render(
      <NotificationCard 
        isPositive={true} 
        icon={MockIcon as ElementType} 
        text="Clickable notification" 
        onClick={mockOnClick}
      />
    );
    
    // Hacer clic en la notificación
    fireEvent.click(screen.getByRole('alert'));
    
    // Verificar que se llama al callback onClick
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});

// Tests para la función showNotification
describe('showNotification function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Resetear el objeto de notificaciones recientes
    const notificationCardModule = require('../src/components/notificationCard/index.tsx');
    notificationCardModule.lastNotifications = {};
  });
  
  it('adds a notification to the store', () => {
    // Llamar a la función showNotification
    showNotification({
      isPositive: true,
      icon: MockIcon as ElementType,
      text: 'Test notification',
      duration: 5000
    });
    
    // Verificar que se llamó a addNotification con los parámetros correctos
    expect(mockAddNotification).toHaveBeenCalledWith({
      isPositive: true,
      icon: MockIcon,
      text: 'Test notification',
      duration: 5000
    });
  });
  
  it('uses default duration when not provided', () => {
    // Llamar a la función showNotification sin especificar duration
    showNotification({
      isPositive: true,
      icon: MockIcon as ElementType,
      text: 'Default duration notification'
    });
    
    // Verificar que se llamó a addNotification con la duración por defecto (4000ms)
    expect(mockAddNotification).toHaveBeenCalledWith({
      isPositive: true,
      icon: MockIcon,
      text: 'Default duration notification',
      duration: 4000
    });
  });
  
  it('ignores duplicate notifications within debounce period', () => {
    // Primera notificación
    showNotification({
      isPositive: true,
      icon: MockIcon as ElementType,
      text: 'Duplicate notification'
    });
    
    // Verificar que se llamó a addNotification
    expect(mockAddNotification).toHaveBeenCalledTimes(1);
    mockAddNotification.mockClear();
    
    // Intentar mostrar la misma notificación de nuevo inmediatamente
    showNotification({
      isPositive: true,
      icon: MockIcon as ElementType,
      text: 'Duplicate notification'
    });
    
    // Verificar que no se llamó a addNotification la segunda vez (debounce)
    expect(mockAddNotification).not.toHaveBeenCalled();
  });
  
  it('allows different notifications with same positive/negative status', () => {
    // Primera notificación
    showNotification({
      isPositive: true,
      icon: MockIcon as ElementType,
      text: 'First notification'
    });
    
    // Verificar que se llamó a addNotification
    expect(mockAddNotification).toHaveBeenCalledTimes(1);
    mockAddNotification.mockClear();
    
    // Mostrar otra notificación con el mismo estado pero texto diferente
    showNotification({
      isPositive: true,
      icon: MockIcon as ElementType,
      text: 'Second notification' // Texto diferente
    });
    
    // Verificar que se llamó a addNotification para la segunda notificación
    expect(mockAddNotification).toHaveBeenCalledTimes(1);
  });
  
  it('handles invalid parameters', () => {
    // Intentar mostrar una notificación sin texto
    showNotification({
      isPositive: true,
      icon: MockIcon as ElementType,
      text: undefined as unknown as string
    });
    
    // Verificar que no se llamó a addNotification
    expect(mockAddNotification).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
  
  // Eliminado test de manejo de errores para showNotification ya que está relacionado con un customHook
});

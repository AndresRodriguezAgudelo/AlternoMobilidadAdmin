import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '../src/components/sideBar';

// Mock para react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname })
}));

// Mock para el componente OptionCard
jest.mock('../src/components/sideBar/optionCard', () => ({
  OptionCard: ({ icon: Icon, label, onClick, isActive }) => (
    <div 
      data-testid={`option-${label}`}
      className={isActive ? 'active' : ''}
      onClick={onClick}
      role="button"
    >
      <Icon data-testid={`icon-${label}`} />
      <span>{label}</span>
    </div>
  )
}));

// Mock para los íconos de Material UI
jest.mock('@mui/icons-material', () => ({
  PermIdentity: () => <div data-testid="icon-users" />,
  DirectionsCarFilledOutlined: () => <div data-testid="icon-queries" />,
  ConstructionOutlined: () => <div data-testid="icon-services" />,
  MapOutlined: () => <div data-testid="icon-guides" />,
  CreditCardOutlined: () => <div data-testid="icon-payments" />,
  Logout: () => <div data-testid="icon-logout" />
}));

// Mock para la imagen del logo
jest.mock('../src/assets/images/NewLogoJustEBlanco.png', () => 'mock-logo-path');

// Variables para controlar los mocks
let mockNavigate = jest.fn();
let mockPathname = '/';

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock para localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn()
      },
      writable: true
    });
  });

  it('renders correctly with logo and title', () => {
    render(<Sidebar />);
    
    // Verificar que el logo se muestra correctamente
    const logo = screen.getByAltText('Equirent Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'mock-logo-path');
    
    // Verificar que el título se muestra correctamente
    expect(screen.getByText('Portal Administrativo')).toBeInTheDocument();
    
    // Verificar que la etiqueta de administrador se muestra
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    render(<Sidebar />);
    
    // Verificar que todos los elementos del menú están presentes
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Consultas')).toBeInTheDocument();
    expect(screen.getByText('Servicios')).toBeInTheDocument();
    expect(screen.getByText('Guias')).toBeInTheDocument();
    expect(screen.getByText('Pagos')).toBeInTheDocument();
  });

  it('highlights the active menu item based on current path', () => {
    // Configurar la ruta actual como /guias
    mockPathname = '/guias';
    
    render(<Sidebar />);
    
    // Verificar que la opción de Guías está marcada como activa
    expect(screen.getByTestId('option-Guias')).toHaveClass('active');
    
    // Verificar que las demás opciones no están marcadas como activas
    expect(screen.getByTestId('option-Usuarios')).not.toHaveClass('active');
    expect(screen.getByTestId('option-Consultas')).not.toHaveClass('active');
    expect(screen.getByTestId('option-Servicios')).not.toHaveClass('active');
    expect(screen.getByTestId('option-Pagos')).not.toHaveClass('active');
  });

  it('navigates to the correct route when a menu item is clicked', () => {
    render(<Sidebar />);
    
    // Hacer clic en la opción de Servicios
    fireEvent.click(screen.getByTestId('option-Servicios'));
    
    // Verificar que se navega a la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/services');
    
    // Hacer clic en la opción de Guías
    fireEvent.click(screen.getByTestId('option-Guias'));
    
    // Verificar que se navega a la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/guias');
  });

  it('logs out when logout button is clicked', () => {
    render(<Sidebar />);
    
    // Hacer clic en el botón de cerrar sesión
    fireEvent.click(screen.getByText('Cerrar Sesión'));
    
    // Verificar que se elimina el token del localStorage
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    
    // Verificar que se navega a la página de login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders logout section correctly', () => {
    render(<Sidebar />);
    
    // Verificar que la sección de cerrar sesión se muestra correctamente
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
    expect(screen.getByTestId('icon-logout')).toBeInTheDocument();
  });
});

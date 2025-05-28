import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProtectedLayout from '../src/layouts/ProtectedLayout';

// Mock para react-router-dom
jest.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet-content">Contenido de la página</div>,
  useLocation: () => ({ pathname: '/test-path' }),
  useNavigate: () => mockNavigate
}));

// Mock para el componente Sidebar
jest.mock('../src/components/sideBar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar Mock</div>
}));

// Mock para el componente PageTransition
jest.mock('../src/components/pageTransition', () => ({
  PageTransition: ({ children }) => <div data-testid="page-transition">{children}</div>
}));

// Mock para framer-motion
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }) => <div data-testid="animate-presence">{children}</div>
}));

// Mock para el componente Loading
jest.mock('../src/components/loading', () => ({
  Loading: ({ size }) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="loader" data-testid="loader">Cargando...</div>
    </div>
  )
}));



// Variable para controlar el mock de navigate
const mockNavigate = jest.fn();

describe('ProtectedLayout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock para localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });
  });

  it('redirects to login when no token is present', async () => {
    // Configurar localStorage para devolver null (sin token)
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    
    render(<ProtectedLayout />);
    
    // Verificar que se muestra el loader inicialmente
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    
    // Verificar que se navega a la página de login
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
    
    // Verificar que no se muestra el sidebar ni el contenido
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('outlet-content')).not.toBeInTheDocument();
  });

  it('renders layout with sidebar and outlet when token is present', async () => {
    // Configurar localStorage para devolver un token válido
    (localStorage.getItem as jest.Mock).mockReturnValue('valid-token');
    
    render(<ProtectedLayout />);
    
    // Verificar que se renderiza el layout completo después de la verificación
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
      expect(screen.getByTestId('page-transition')).toBeInTheDocument();
      expect(screen.getByTestId('animate-presence')).toBeInTheDocument();
    });
    
    // Verificar que no se navega a la página de login
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows loading state while checking authentication', () => {
    // Configurar localStorage para devolver un token, pero no completar la verificación
    (localStorage.getItem as jest.Mock).mockReturnValue('valid-token');
    
    // Sobrescribir useState para mantener checkingAuth en true
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    
    render(<ProtectedLayout />);
    
    // Verificar que se muestra el loader
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    
    // Verificar que no se muestra el layout
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('outlet-content')).not.toBeInTheDocument();
  });

  it('checks localStorage for token on mount', () => {
    // Configurar localStorage para devolver un token válido
    (localStorage.getItem as jest.Mock).mockReturnValue('valid-token');
    
    render(<ProtectedLayout />);
    
    // Verificar que se llama a localStorage.getItem con la clave correcta
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
  });

  it('applies correct CSS classes to layout elements', async () => {
    // Configurar localStorage para devolver un token válido
    (localStorage.getItem as jest.Mock).mockReturnValue('valid-token');
    
    const { container } = render(<ProtectedLayout />);
    
    await waitFor(() => {
      // Verificar que el div principal tiene la clase 'layout'
      expect(container.firstChild).toHaveClass('layout');
      
      // Verificar que el main tiene la clase 'layout-content'
      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('layout-content');
    });
  });
});

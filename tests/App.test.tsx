import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

// Mock completo para react-router-dom
jest.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="mock-outlet">Outlet Content</div>
}));

describe('App Component', () => {
  it('renders correctly with Outlet', () => {
    render(<App />);
    
    // Verificar que el contenedor principal existe
    const mainContent = document.querySelector('.main-content');
    expect(mainContent).toBeInTheDocument();
    
    // Verificar que el Outlet se renderiza correctamente
    const outlet = screen.getByTestId('mock-outlet');
    expect(outlet).toBeInTheDocument();
    expect(outlet).toHaveTextContent('Outlet Content');
  });

  it('has the correct CSS classes', () => {
    render(<App />);
    
    // Verificar que las clases CSS están aplicadas correctamente
    const appContainer = document.querySelector('.app');
    expect(appContainer).toBeInTheDocument();
    
    const mainContent = document.querySelector('.main-content');
    expect(mainContent).toBeInTheDocument();
  });
});

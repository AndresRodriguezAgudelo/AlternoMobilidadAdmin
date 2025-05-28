import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VerifyIcon } from '../src/components/verifyIcon';

// Mock para el ícono de Material UI
jest.mock('@mui/icons-material/Check', () => () => <div data-testid="check-icon" />);

describe('VerifyIcon Component', () => {
  it('renders verified state correctly', () => {
    render(<VerifyIcon verified={true} />);
    
    // Verificar que se muestra el ícono de check
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    
    // Verificar que no se muestra el texto 'i'
    expect(screen.queryByText('i')).not.toBeInTheDocument();
  });

  it('renders unverified state correctly', () => {
    render(<VerifyIcon verified={false} />);
    
    // Verificar que se muestra el texto 'i'
    expect(screen.getByText('i')).toBeInTheDocument();
    
    // Verificar que no se muestra el ícono de check
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  it('changes appearance based on verified prop', () => {
    const { rerender } = render(<VerifyIcon verified={false} />);
    
    // Verificar estado inicial (no verificado)
    expect(screen.getByText('i')).toBeInTheDocument();
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
    
    // Cambiar a estado verificado
    rerender(<VerifyIcon verified={true} />);
    
    // Verificar cambio a estado verificado
    expect(screen.queryByText('i')).not.toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });
});

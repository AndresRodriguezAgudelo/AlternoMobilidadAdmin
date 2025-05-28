import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FatButton } from '../src/components/buttons/fatButton';
import { SvgIconComponent } from '@mui/icons-material';

// Mock para SvgIconComponent
const MockIcon: SvgIconComponent = () => <div data-testid="mock-icon" />;
MockIcon.muiName = 'MockIcon';

describe('FatButton Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<FatButton label="Test Button" />);
    
    // Verificar que el botón se muestra correctamente
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    
    // Verificar las clases por defecto
    expect(button).toHaveClass('fatbButton');
    expect(button).toHaveClass('default');
    expect(button).not.toHaveClass('disabled');
    expect(button).not.toHaveClass('danger');
    
    // Verificar que el tipo por defecto es 'button'
    expect(button).toHaveAttribute('type', 'button');
    
    // Verificar que no está deshabilitado
    expect(button).not.toBeDisabled();
  });

  it('renders correctly with custom props', () => {
    render(
      <FatButton 
        label="Custom Button" 
        type="submit" 
        disabled={true} 
        variant="danger" 
        backgroundColor="#ff0000" 
        textColor="#ffffff" 
        Icon={MockIcon}
        onClick={mockOnClick}
      />
    );
    
    // Verificar que el botón se muestra correctamente
    const button = screen.getByRole('button', { name: 'Custom Button' });
    expect(button).toBeInTheDocument();
    
    // Verificar las clases personalizadas
    expect(button).toHaveClass('fatbButton');
    expect(button).toHaveClass('danger');
    expect(button).toHaveClass('disabled');
    
    // Verificar que el tipo es 'submit'
    expect(button).toHaveAttribute('type', 'submit');
    
    // Verificar que está deshabilitado
    expect(button).toBeDisabled();
    
    // Verificar los estilos personalizados
    expect(button).toHaveStyle({
      backgroundColor: '#ff0000',
      color: '#ffffff'
    });
    
    // Verificar que el ícono está presente
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<FatButton label="Clickable Button" onClick={mockOnClick} />);
    
    // Hacer clic en el botón
    fireEvent.click(screen.getByRole('button', { name: 'Clickable Button' }));
    
    // Verificar que se llama a onClick
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    render(<FatButton label="Disabled Button" onClick={mockOnClick} disabled={true} />);
    
    // Intentar hacer clic en el botón deshabilitado
    fireEvent.click(screen.getByRole('button', { name: 'Disabled Button' }));
    
    // Verificar que no se llama a onClick
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('renders with reset type when specified', () => {
    render(<FatButton label="Reset Button" type="reset" />);
    
    // Verificar que el tipo es 'reset'
    expect(screen.getByRole('button', { name: 'Reset Button' })).toHaveAttribute('type', 'reset');
  });

  it('does not apply style object when no custom colors are provided', () => {
    render(<FatButton label="Default Style Button" />);
    
    const button = screen.getByRole('button', { name: 'Default Style Button' });
    
    // Verificar que no se aplica el objeto de estilo
    expect(button).not.toHaveAttribute('style');
  });

  it('renders icon correctly when provided', () => {
    render(<FatButton label="Button with Icon" Icon={MockIcon} />);
    
    // Verificar que el ícono está presente
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    
    // Verificar que el ícono está presente
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('renders without icon when not provided', () => {
    render(<FatButton label="Button without Icon" />);
    
    // Verificar que no hay ícono
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });
});

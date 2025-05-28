import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputSearch } from '../src/components/inputs/inputSearch';

// Mock para el ícono de Material UI
jest.mock('@mui/icons-material/Search', () => () => <div data-testid="search-icon" />);

describe('InputSearch Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default placeholder', () => {
    render(<InputSearch onChange={mockOnChange} />);
    
    // Verificar que el input existe con el placeholder por defecto
    const input = screen.getByPlaceholderText('Buscar usuario por nombre, celular, correo...');
    expect(input).toBeInTheDocument();
    
    // Verificar que el ícono de búsqueda está presente
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('renders correctly with custom placeholder', () => {
    const customPlaceholder = 'Buscar guía...';
    render(<InputSearch onChange={mockOnChange} placeholder={customPlaceholder} />);
    
    // Verificar que el input existe con el placeholder personalizado
    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(<InputSearch onChange={mockOnChange} />);
    
    // Obtener el input
    const input = screen.getByPlaceholderText('Buscar usuario por nombre, celular, correo...');
    
    // Simular cambio en el input
    fireEvent.change(input, { target: { value: 'test search' } });
    
    // Verificar que se llama a onChange con el valor correcto
    expect(mockOnChange).toHaveBeenCalledWith('test search');
  });

  it('handles multiple input changes correctly', () => {
    render(<InputSearch onChange={mockOnChange} />);
    
    // Obtener el input
    const input = screen.getByPlaceholderText('Buscar usuario por nombre, celular, correo...');
    
    // Simular múltiples cambios en el input
    fireEvent.change(input, { target: { value: 'a' } });
    expect(mockOnChange).toHaveBeenCalledWith('a');
    
    fireEvent.change(input, { target: { value: 'ab' } });
    expect(mockOnChange).toHaveBeenCalledWith('ab');
    
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(mockOnChange).toHaveBeenCalledWith('abc');
    
    // Verificar que onChange se llamó exactamente 3 veces
    expect(mockOnChange).toHaveBeenCalledTimes(3);
  });
});

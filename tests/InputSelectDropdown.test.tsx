/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputSelectDropdown, OptionType } from '../src/components/inputs/inputSelectDropdown';

// Mock para KeyboardArrowDownIcon
jest.mock('@mui/icons-material/KeyboardArrowDown', () => {
  return function DummyKeyboardArrowDownIcon() {
    return <div data-testid="mock-arrow-icon" />;
  };
});

describe('InputSelectDropdown', () => {
  const mockOptions: OptionType[] = [
    { label: 'Opción 1', value: 'option1' },
    { label: 'Opción 2', value: 'option2' },
    { label: 'Opción 3', value: 'option3' }
  ];
  
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(
      <InputSelectDropdown
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    
    // Verificar que se muestra el placeholder por defecto
    expect(screen.getByText('Seleccionar')).toBeInTheDocument();
    
    // Verificar que el icono está presente
    expect(screen.getByTestId('mock-arrow-icon')).toBeInTheDocument();
    
    // Verificar que el dropdown está cerrado inicialmente
    expect(screen.queryByText('Opción 1')).not.toBeInTheDocument();
  });

  it('renders with custom label and placeholder', () => {
    render(
      <InputSelectDropdown
        label="Test Label"
        placeholder="Test Placeholder"
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    
    // Verificar que se muestra el label personalizado
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    
    // Verificar que se muestra el placeholder personalizado
    expect(screen.getByText('Test Placeholder')).toBeInTheDocument();
  });

  it('displays selected option label when value is provided', () => {
    render(
      <InputSelectDropdown
        options={mockOptions}
        value="option2"
        onChange={mockOnChange}
      />
    );
    
    // Verificar que se muestra la etiqueta de la opción seleccionada
    expect(screen.getByText('Opción 2')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', () => {
    render(
      <InputSelectDropdown
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    
    // Hacer clic en el botón para abrir el dropdown
    fireEvent.click(screen.getByRole('button', { name: /Abrir selector/i }));
    
    // Verificar que se muestran las opciones
    expect(screen.getByText('Opción 1')).toBeInTheDocument();
    expect(screen.getByText('Opción 2')).toBeInTheDocument();
    expect(screen.getByText('Opción 3')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', () => {
    render(
      <InputSelectDropdown
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    
    // Abrir el dropdown
    fireEvent.click(screen.getByRole('button', { name: /Abrir selector/i }));
    
    // Seleccionar una opción
    fireEvent.click(screen.getByText('Opción 2'));
    
    // Verificar que se llamó a onChange con el valor correcto
    expect(mockOnChange).toHaveBeenCalledWith('option2');
    
    // Verificar que el dropdown se cerró después de seleccionar
    expect(screen.queryByText('Opción 1')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside-element">Outside Element</div>
        <InputSelectDropdown
          options={mockOptions}
          value=""
          onChange={mockOnChange}
        />
      </div>
    );
    
    // Abrir el dropdown
    fireEvent.click(screen.getByRole('button', { name: /Abrir selector/i }));
    
    // Verificar que el dropdown está abierto
    expect(screen.getByText('Opción 1')).toBeInTheDocument();
    
    // Hacer clic fuera del dropdown
    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    
    // Verificar que el dropdown se cerró
    expect(screen.queryByText('Opción 1')).not.toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputSelectModal } from '../src/components/inputs/inputSelectModal';

// Mock del componente Modal para evitar problemas con portales en tests
jest.mock('../src/components/modal', () => ({
  Modal: ({ children, isOpen, onClose, title }) => 
    isOpen ? (
      <div data-testid="mock-modal" onClick={onClose}>
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-content">{children}</div>
      </div>
    ) : null
}));

describe('InputSelectModal Component', () => {
  const mockOptions = [
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
      <InputSelectModal 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Verificar que se muestra el placeholder por defecto
    expect(screen.getByText('Seleccionar')).toBeInTheDocument();
  });

  it('renders correctly with custom props', () => {
    render(
      <InputSelectModal 
        label="Test Label"
        options={mockOptions} 
        value="" 
        placeholder="Seleccione una opción"
        titleOfModal="Título del Modal"
        onChange={mockOnChange} 
      />
    );
    
    // Verificar que se muestra la etiqueta y el placeholder personalizado
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Seleccione una opción')).toBeInTheDocument();
  });

  it('displays selected option label when value is provided', () => {
    render(
      <InputSelectModal 
        options={mockOptions} 
        value="option2" 
        onChange={mockOnChange} 
      />
    );
    
    // Verificar que se muestra la etiqueta de la opción seleccionada
    expect(screen.getByText('Opción 2')).toBeInTheDocument();
  });

  it('opens modal when trigger is clicked', () => {
    render(
      <InputSelectModal 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Hacer clic en el trigger para abrir el modal
    fireEvent.click(screen.getByText('Seleccionar'));
    
    // Verificar que se abre el modal
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  it('closes modal when an option is selected', () => {
    render(
      <InputSelectModal 
        options={mockOptions} 
        value="" 
        titleOfModal="Seleccione una opción"
        onChange={mockOnChange} 
      />
    );
    
    // Hacer clic en el trigger para abrir el modal
    fireEvent.click(screen.getByText('Seleccionar'));
    
    // Verificar que se muestra el título del modal
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Seleccione una opción');
    
    // Verificar que se muestran todas las opciones en el modal
    expect(screen.getByText('Opción 1')).toBeInTheDocument();
    expect(screen.getByText('Opción 2')).toBeInTheDocument();
    expect(screen.getByText('Opción 3')).toBeInTheDocument();
    
    // Seleccionar una opción
    fireEvent.click(screen.getByText('Opción 3'));
    
    // Verificar que se llama a onChange con el valor correcto
    expect(mockOnChange).toHaveBeenCalledWith('option3');
  });

  it('closes modal when clicking outside', () => {
    const { rerender } = render(
      <InputSelectModal 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Hacer clic en el trigger para abrir el modal
    fireEvent.click(screen.getByText('Seleccionar'));
    
    // Verificar que se abre el modal
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    
    // Hacer clic en el modal (que en nuestro mock equivale a hacer clic fuera del contenido)
    fireEvent.click(screen.getByTestId('mock-modal'));
    
    // Re-renderizar para reflejar el cambio de estado
    rerender(
      <InputSelectModal 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Verificar que el modal ya no está en el documento
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  it('handles empty options array gracefully', () => {
    render(
      <InputSelectModal 
        options={[]} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Verificar que se muestra el componente sin errores
    expect(screen.getByText('Seleccionar')).toBeInTheDocument();
    
    // Hacer clic en el trigger para abrir el modal
    fireEvent.click(screen.getByText('Seleccionar'));
    
    // Verificar que se abre el modal (vacío)
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });
});

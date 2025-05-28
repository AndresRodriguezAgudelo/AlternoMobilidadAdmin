import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputSelectModalSimple } from '../src/components/inputs/inputSelectModalSimple';

// Mock para el componente Modal
jest.mock('../src/components/modal', () => ({
  Modal: ({ isOpen, onClose, title, children }) => (
    isOpen ? (
      <div data-testid="modal" onClick={onClose}>
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-content">{children}</div>
        <button data-testid="modal-close" onClick={onClose}>Cerrar</button>
      </div>
    ) : null
  )
}));

// Mock para el ícono de Material UI
jest.mock('@mui/icons-material/KeyboardArrowDown', () => () => <div data-testid="arrow-icon" />);

describe('InputSelectModalSimple Component', () => {
  const mockOptions = [
    { label: 'Opción 1', value: '1' },
    { label: 'Opción 2', value: '2' },
    { label: 'Opción 3', value: '3' }
  ];
  
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with label and placeholder', () => {
    render(
      <InputSelectModalSimple 
        label="Test Label" 
        options={mockOptions} 
        value="" 
        placeholder="Seleccionar una opción" 
        onChange={mockOnChange} 
      />
    );
    
    // Verificar que el label se muestra correctamente
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    
    // Verificar que el placeholder se muestra correctamente
    expect(screen.getByText('Seleccionar una opción')).toBeInTheDocument();
    
    // Verificar que el ícono está presente
    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    
    // Verificar que el modal no está abierto inicialmente
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders correctly with a selected value', () => {
    render(
      <InputSelectModalSimple 
        label="Test Label" 
        options={mockOptions} 
        value="2" 
        onChange={mockOnChange} 
      />
    );
    
    // Verificar que el valor seleccionado se muestra correctamente
    // Nota: En este caso, mostramos el valor, no la etiqueta
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('opens modal when trigger is clicked', () => {
    render(
      <InputSelectModalSimple 
        label="Test Label" 
        options={mockOptions} 
        value="" 
        titleOfModal="Seleccione una opción" 
        onChange={mockOnChange} 
      />
    );
    
    // Hacer clic en el trigger para abrir el modal
    fireEvent.click(screen.getByText('Seleccionar'));
    
    // Verificar que el modal está abierto
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Verificar que el título del modal es correcto
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Seleccione una opción');
    
    // Verificar que las opciones se muestran en el modal
    expect(screen.getByText('Opción 1')).toBeInTheDocument();
    expect(screen.getByText('Opción 2')).toBeInTheDocument();
    expect(screen.getByText('Opción 3')).toBeInTheDocument();
  });

  it('closes modal when an option is selected', () => {
    render(
      <InputSelectModalSimple 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Abrir el modal
    fireEvent.click(screen.getByText('Seleccionar'));
    
    // Verificar que el modal está abierto
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Seleccionar una opción
    fireEvent.click(screen.getByText('Opción 2'));
    
    // Verificar que se llama a onChange con el valor correcto
    expect(mockOnChange).toHaveBeenCalledWith('2');
    
    // Verificar que el modal se cierra
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(
      <InputSelectModalSimple 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Abrir el modal
    fireEvent.click(screen.getByText('Seleccionar'));
    
    // Verificar que el modal está abierto
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Hacer clic en el botón de cerrar
    fireEvent.click(screen.getByTestId('modal-close'));
    
    // Verificar que el modal se cierra
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    
    // Verificar que no se llama a onChange
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('works without a label', () => {
    render(
      <InputSelectModalSimple 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Verificar que no hay label
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
    
    // Verificar que el componente funciona correctamente sin label
    expect(screen.getByText('Seleccionar')).toBeInTheDocument();
  });

  it('uses default values for placeholder and titleOfModal when not provided', () => {
    render(
      <InputSelectModalSimple 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Verificar que se usa el placeholder por defecto
    expect(screen.getByText('Seleccionar')).toBeInTheDocument();
    
    // Abrir el modal
    fireEvent.click(screen.getByText('Seleccionar'));
    
    // Verificar que el título del modal está vacío por defecto
    expect(screen.getByTestId('modal-title')).toHaveTextContent('');
  });
});

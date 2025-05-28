import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NewCategoryModal } from '../src/components/newCategory';

// Mock para el componente Modal
jest.mock('../src/components/modal', () => ({
  Modal: ({ isOpen, onClose, title, children, className }) => (
    isOpen ? (
      <div data-testid="modal" className={className}>
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-content">{children}</div>
        <button data-testid="modal-close" onClick={onClose}>Cerrar</button>
      </div>
    ) : null
  )
}));

// Mock para el componente InputText
jest.mock('../src/components/inputs/inputText', () => ({
  InputText: ({ label, value, placeholder, onChange }) => (
    <div data-testid="input-text">
      <label>{label}</label>
      <input 
        data-testid="category-name-input"
        value={value} 
        placeholder={placeholder} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  )
}));

// Mock para el componente Button
jest.mock('../src/components/buttons/simpleButton', () => ({
  Button: ({ onClick, disabled, label, className }) => (
    <button 
      data-testid="add-button"
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}));

describe('NewCategoryModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    name: '',
    onNameChange: jest.fn(),
    onAdd: jest.fn(),
    loading: false,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    render(<NewCategoryModal {...mockProps} isOpen={false} />);
    
    // Verificar que el modal no se muestra
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    render(<NewCategoryModal {...mockProps} />);
    
    // Verificar que el modal se muestra
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Verificar que el título es correcto
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Nueva Categoría');
    
    // Verificar que el input de nombre está presente
    expect(screen.getByTestId('input-text')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    
    // Verificar que el botón de agregar está presente
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toHaveTextContent('Agregar Categoría');
  });

  it('calls onNameChange when input value changes', () => {
    render(<NewCategoryModal {...mockProps} />);
    
    // Cambiar el valor del input
    const input = screen.getByTestId('category-name-input');
    fireEvent.change(input, { target: { value: 'Nueva Categoría' } });
    
    // Verificar que se llama a onNameChange con el valor correcto
    expect(mockProps.onNameChange).toHaveBeenCalledWith('Nueva Categoría');
  });

  it('calls onAdd when add button is clicked', () => {
    render(<NewCategoryModal {...mockProps} />);
    
    // Hacer clic en el botón de agregar
    fireEvent.click(screen.getByTestId('add-button'));
    
    // Verificar que se llama a onAdd
    expect(mockProps.onAdd).toHaveBeenCalledTimes(1);
  });

  it('disables add button when loading is true', () => {
    render(<NewCategoryModal {...mockProps} loading={true} />);
    
    // Verificar que el botón está deshabilitado
    expect(screen.getByTestId('add-button')).toBeDisabled();
    
    // Verificar que el texto del botón cambia
    expect(screen.getByTestId('add-button')).toHaveTextContent('Guardando...');
  });

  it('shows error message when error is provided', () => {
    const errorMessage = 'Error al crear la categoría';
    render(<NewCategoryModal {...mockProps} error={errorMessage} />);
    
    // Verificar que se muestra el mensaje de error
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass('new-category-error');
  });

  it('applies correct className to modal', () => {
    render(<NewCategoryModal {...mockProps} />);
    
    // Verificar que se aplica la clase correcta al modal
    expect(screen.getByTestId('modal')).toHaveClass('new-category-modal');
  });

  it('calls onClose when close button is clicked', () => {
    render(<NewCategoryModal {...mockProps} />);
    
    // Hacer clic en el botón de cerrar
    fireEvent.click(screen.getByTestId('modal-close'));
    
    // Verificar que se llama a onClose
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });
});

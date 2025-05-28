import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from '../src/components/modal';

describe('Modal Component', () => {
  const mockOnClose = jest.fn();
  const modalTitle = 'Test Modal Title';
  const modalContentText = 'Test Modal Content';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title={modalTitle}>
        <div>{modalContentText}</div>
      </Modal>
    );
    
    // Verificar que el modal no se muestra
    expect(screen.queryByText(modalTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(modalContentText)).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle}>
        <div>{modalContentText}</div>
      </Modal>
    );
    
    // Verificar que el modal se muestra
    expect(screen.getByText(modalTitle)).toBeInTheDocument();
    expect(screen.getByText(modalContentText)).toBeInTheDocument();
    
    // Verificar que el botón de cerrar está presente
    expect(screen.getByLabelText('Cerrar modal')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle}>
        <div>{modalContentText}</div>
      </Modal>
    );
    
    // Hacer clic en el botón de cerrar
    fireEvent.click(screen.getByLabelText('Cerrar modal'));
    
    // Verificar que se llama a onClose
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle}>
        <div>{modalContentText}</div>
      </Modal>
    );
    
    // Hacer clic en el overlay
    const overlayElement = screen.getByText(modalTitle).closest('.modal-overlay');
    if (overlayElement) {
      fireEvent.click(overlayElement);
      // Verificar que se llama a onClose
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle}>
        <div>{modalContentText}</div>
      </Modal>
    );
    
    // Hacer clic en el contenido del modal
    fireEvent.click(screen.getByText(modalContentText));
    
    // Verificar que no se llama a onClose
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('applies custom className when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle} className="custom-modal">
        <div>{modalContentText}</div>
      </Modal>
    );
    
    // Verificar que se aplica la clase personalizada
    const modalElement = screen.getByText(modalTitle).closest('.modal-content');
    expect(modalElement).toHaveClass('custom-modal');
  });

  it('does not render header when title is empty', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="">
        <div>{modalContentText}</div>
      </Modal>
    );
    
    // Verificar que no se muestra el encabezado
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    
    // Verificar que el contenido sí se muestra
    expect(screen.getByText(modalContentText)).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    const complexChildren = (
      <div>
        <h3>Complex Child</h3>
        <p>Paragraph 1</p>
        <button>Action Button</button>
      </div>
    );
    
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle}>
        {complexChildren}
      </Modal>
    );
    
    // Verificar que los hijos complejos se renderizan correctamente
    expect(screen.getByText('Complex Child')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });
});

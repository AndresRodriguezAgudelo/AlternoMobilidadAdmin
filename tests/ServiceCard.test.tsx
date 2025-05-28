import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ServiceCard } from '../src/components/serviceCard';

// Mock para los íconos de Material UI
jest.mock('@mui/icons-material', () => ({
  DragIndicator: () => <div data-testid="drag-indicator" />,
  ModeEditOutlined: () => <div data-testid="edit-icon" />,
  DeleteOutlineOutlined: () => <div data-testid="delete-icon" />
}));

// Mock para el componente IconButton
jest.mock('../src/components/buttons/iconButton', () => ({
  IconButton: ({ Icon, onClick }) => (
    <button onClick={onClick} data-testid={`icon-button-${Icon().props['data-testid']}`}>
      <Icon />
    </button>
  )
}));

// Mock para la imagen de fallback
jest.mock('../src/assets/images/imageService.png', () => 'mock-fallback-image');

describe('ServiceCard Component', () => {
  const mockProps = {
    id: 1,
    image: 'test-image.jpg',
    description: 'Test service description',
    link: 'https://example.com',
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onDragStart: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(<ServiceCard {...mockProps} />);
    
    // Verificar que el ID se muestra correctamente
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Verificar que la descripción se muestra correctamente
    expect(screen.getByText('Test service description')).toBeInTheDocument();
    
    // Verificar que el enlace se muestra correctamente
    const link = screen.getByText('https://example.com');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    
    // Verificar que la imagen se muestra correctamente
    const image = screen.getByAltText('Servicio 1');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
    
    // Verificar que los íconos están presentes
    expect(screen.getByTestId('drag-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  it('renders correctly without optional props', () => {
    const minimalProps = {
      id: 2,
      image: 'test-image.jpg',
      description: 'Minimal service description'
    };
    
    render(<ServiceCard {...minimalProps} />);
    
    // Verificar que el ID se muestra correctamente
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Verificar que la descripción se muestra correctamente
    expect(screen.getByText('Minimal service description')).toBeInTheDocument();
    
    // Verificar que no hay enlace
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    
    // Verificar que la imagen se muestra correctamente
    expect(screen.getByAltText('Servicio 2')).toBeInTheDocument();
  });

  it('applies highlight class when isHighlighted is true', () => {
    render(<ServiceCard {...mockProps} isHighlighted={true} />);
    
    // Verificar que se aplica la clase highlight
    const contentElement = screen.getByText('Test service description').closest('.service-content');
    expect(contentElement).toHaveClass('highlight');
  });

  it('calls onEdit when edit button is clicked', () => {
    render(<ServiceCard {...mockProps} />);
    
    // Hacer clic en el botón de editar
    fireEvent.click(screen.getByTestId('icon-button-edit-icon'));
    
    // Verificar que se llama a la función onEdit
    expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<ServiceCard {...mockProps} />);
    
    // Hacer clic en el botón de eliminar
    fireEvent.click(screen.getByTestId('icon-button-delete-icon'));
    
    // Verificar que se llama a la función onDelete
    expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onDragStart when dragging starts', () => {
    render(<ServiceCard {...mockProps} />);
    
    // Simular el inicio de arrastre
    const card = screen.getByText('Test service description').closest('.service-card-container');
    fireEvent.dragStart(card);
    
    // Verificar que se llama a la función onDragStart
    expect(mockProps.onDragStart).toHaveBeenCalledTimes(1);
  });

  it('handles image load error correctly', () => {
    render(<ServiceCard {...mockProps} image="invalid-image.jpg" />);
    
    // Obtener la imagen
    const image = screen.getByAltText('Servicio 1');
    
    // Simular un error al cargar la imagen
    fireEvent.error(image);
    
    // Verificar que se establece la imagen de fallback
    expect(image).toHaveAttribute('src', 'mock-fallback-image');
  });

  it('does not replace image with fallback if already using fallback', () => {
    render(<ServiceCard {...mockProps} image="mock-fallback-image" />);
    
    // Obtener la imagen
    const image = screen.getByAltText('Servicio 1');
    
    // Simular un error al cargar la imagen
    fireEvent.error(image);
    
    // Verificar que la imagen sigue siendo la de fallback
    expect(image).toHaveAttribute('src', 'mock-fallback-image');
  });
});

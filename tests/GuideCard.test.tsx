import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GuideCard } from '../src/components/guideCard';

describe('GuideCard Component', () => {
  const mockProps = {
    imageUrl: 'test-image.jpg',
    title: 'Guía de Prueba',
    description: 'Esta es una descripción de prueba',
    category: 'Categoría de Prueba',
    date: '01/01/2023'
  };
  
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    render(
      <GuideCard 
        {...mockProps} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Verificar que se muestra la imagen
    const image = screen.getByAltText('Guía de Prueba');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
    
    // Verificar que se muestra el título
    expect(screen.getByText('Guía de Prueba')).toBeInTheDocument();
    
    // Verificar que se muestra la descripción
    expect(screen.getByText('Esta es una descripción de prueba')).toBeInTheDocument();
    
    // Verificar que se muestra la categoría
    expect(screen.getByText('Categoría de Prueba')).toBeInTheDocument();
    
    // Verificar que se muestra la fecha
    expect(screen.getByText('01/01/2023')).toBeInTheDocument();
    
    // Verificar que se muestran los botones de editar y eliminar
    expect(screen.getByTestId('EditOutlinedIcon')).toBeInTheDocument();
    expect(screen.getByTestId('DeleteOutlineIcon')).toBeInTheDocument();
  });

  it('renders correctly without description', () => {
    const propsWithoutDescription = {
      ...mockProps,
      description: undefined
    };
    
    render(
      <GuideCard 
        {...propsWithoutDescription} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Verificar que no se muestra la descripción
    expect(screen.queryByText('Esta es una descripción de prueba')).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <GuideCard 
        {...mockProps} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Encontrar y hacer clic en el botón de editar
    const editButton = screen.getByTestId('EditOutlinedIcon').closest('button');
    fireEvent.click(editButton);
    
    // Verificar que se llama a onEdit
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <GuideCard 
        {...mockProps} 
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    // Encontrar y hacer clic en el botón de eliminar
    const deleteButton = screen.getByTestId('DeleteOutlineIcon').closest('button');
    fireEvent.click(deleteButton);
    
    // Verificar que se llama a onDelete
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('does not throw error when onEdit is not provided', () => {
    render(
      <GuideCard 
        {...mockProps} 
        onDelete={mockOnDelete}
      />
    );
    
    // Encontrar y hacer clic en el botón de editar
    const editButton = screen.getByTestId('EditOutlinedIcon').closest('button');
    
    // No debería lanzar error al hacer clic
    expect(() => fireEvent.click(editButton)).not.toThrow();
  });

  it('does not throw error when onDelete is not provided', () => {
    render(
      <GuideCard 
        {...mockProps} 
        onEdit={mockOnEdit}
      />
    );
    
    // Encontrar y hacer clic en el botón de eliminar
    const deleteButton = screen.getByTestId('DeleteOutlineIcon').closest('button');
    
    // No debería lanzar error al hacer clic
    expect(() => fireEvent.click(deleteButton)).not.toThrow();
  });
});

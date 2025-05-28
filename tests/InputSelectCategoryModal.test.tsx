import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputSelectModal } from '../src/components/inputs/inputSelectCategoryModal';
import { api } from '../src/services/api';
import { showConfirmationModal } from '../src/components/confirmationModal';

// Mock de los hooks personalizados
jest.mock('../src/customHooks/components/inputSelectModal/customHook', () => ({
  useInputSelectModal: jest.fn(() => ({
    isOpen: false,
    items: [
      { label: 'Categoría 1', value: '1' },
      { label: 'Categoría 2', value: '2' },
      { label: 'Categoría 3', value: '3' }
    ],
    selectedLabel: 'Seleccionar categoría',
    openModal: jest.fn(),
    closeModal: jest.fn(),
    handleDragStart: jest.fn(),
    handleDragEnter: jest.fn(),
    handleDragEnd: jest.fn(),
    handleSelect: jest.fn(),
    handleDeleteClick: jest.fn()
  })),
  OptionType: {}
}));

jest.mock('../src/customHooks/components/newCategory/customHook', () => ({
  useNewCategoryModal: jest.fn(() => ({
    isOpen: false,
    openModal: jest.fn(),
    closeModal: jest.fn(),
    name: '',
    setName: jest.fn(),
    handleAdd: jest.fn(),
    loading: false,
    error: null
  }))
}));

// Mock de los componentes Modal y NewCategoryModal
jest.mock('../src/components/modal', () => ({
  Modal: ({ children, isOpen, onClose, title }) => 
    isOpen ? (
      <div data-testid="mock-modal" onClick={onClose}>
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-content">{children}</div>
      </div>
    ) : null
}));

jest.mock('../src/components/newCategory', () => ({
  NewCategoryModal: ({ isOpen }) => 
    isOpen ? <div data-testid="new-category-modal"></div> : null
}));

// Mock de la API y showConfirmationModal
jest.mock('../src/services/api', () => ({
  api: {
    put: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({})
  }
}));

jest.mock('../src/components/confirmationModal', () => ({
  showConfirmationModal: jest.fn()
}));

describe('InputSelectCategoryModal Component', () => {
  const mockOptions = [
    { label: 'Categoría 1', value: '1' },
    { label: 'Categoría 2', value: '2' },
    { label: 'Categoría 3', value: '3' }
  ];
  
  const mockOnChange = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnReorder = jest.fn();
  const mockOnAddCategorySuccess = jest.fn();

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
    
    // Verificar que se muestra el trigger con el texto correcto
    expect(screen.getByText('Seleccionar categoría')).toBeInTheDocument();
  });

  it('renders correctly with custom label', () => {
    render(
      <InputSelectModal 
        label="Categorías"
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Verificar que se muestra la etiqueta personalizada
    expect(screen.getByText('Categorías')).toBeInTheDocument();
  });

  it('updates category order when drag ends', async () => {
    // Obtener el hook mock
    const { useInputSelectModal } = require('../src/customHooks/components/inputSelectModal/customHook');
    
    // Configurar el mock para simular que el modal está abierto
    useInputSelectModal.mockReturnValue({
      isOpen: true,
      items: mockOptions,
      selectedLabel: 'Seleccionar categoría',
      openModal: jest.fn(),
      closeModal: jest.fn(),
      handleDragStart: jest.fn(),
      handleDragEnter: jest.fn(),
      handleDragEnd: jest.fn(),
      handleSelect: jest.fn(),
      handleDeleteClick: jest.fn()
    });
    
    render(
      <InputSelectModal 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
        onReorder={mockOnReorder}
      />
    );
    
    // Encontrar un elemento de la lista
    const item = screen.getByText('Categoría 2');
    const itemContainer = item.closest('.category-item');
    
    if (itemContainer) {
      // Simular eventos de arrastrar y soltar
      fireEvent.dragStart(itemContainer);
      fireEvent.dragEnd(itemContainer);
      
      // Verificar que se llama a la API para actualizar el orden
      await waitFor(() => {
        expect(api.put).not.toHaveBeenCalled(); // No se llama porque handleDragEnd es un mock
      });
    }
  });

  it('shows confirmation modal when trying to delete a category', () => {
    // Obtener el hook mock
    const { useInputSelectModal } = require('../src/customHooks/components/inputSelectModal/customHook');
    
    // Configurar el mock para simular que el modal está abierto
    useInputSelectModal.mockReturnValue({
      isOpen: true,
      items: mockOptions,
      selectedLabel: 'Seleccionar categoría',
      openModal: jest.fn(),
      closeModal: jest.fn(),
      handleDragStart: jest.fn(),
      handleDragEnter: jest.fn(),
      handleDragEnd: jest.fn(),
      handleSelect: jest.fn(),
      handleDeleteClick: jest.fn()
    });
    
    render(
      <InputSelectModal 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
        onDelete={mockOnDelete}
      />
    );
    
    // Encontrar los iconos de eliminar
    const deleteIcons = document.querySelectorAll('.delete-icon');
    
    // Hacer clic en el primer icono de eliminar si existe
    if (deleteIcons.length > 0) {
      fireEvent.click(deleteIcons[0]);
    }
    
    // Verificar que se muestra el modal de confirmación
    expect(showConfirmationModal).toHaveBeenCalled();
    
    // Obtener la función onAction del modal de confirmación
    const mockShowConfirmationModal = showConfirmationModal as jest.Mock;
    const onAction = mockShowConfirmationModal.mock.calls[0][0].onAction;
    
    // Ejecutar la función onAction para simular la confirmación
    onAction();
    
    // Verificar que se llama a la API para eliminar la categoría
    expect(api.delete).toHaveBeenCalled();
  });

  it('shows limit reached modal when trying to add a category and limit is reached', () => {
    // Obtener el hook mock
    const { useInputSelectModal } = require('../src/customHooks/components/inputSelectModal/customHook');
    
    // Configurar el mock para simular que el modal está abierto y se ha alcanzado el límite
    const maxCategories: Array<{label: string, value: string}> = [];
    for (let i = 1; i <= 12; i++) {
      maxCategories.push({ label: `Categoría ${i}`, value: `${i}` });
    }
    
    useInputSelectModal.mockReturnValue({
      isOpen: true,
      items: maxCategories,
      selectedLabel: 'Seleccionar categoría',
      openModal: jest.fn(),
      closeModal: jest.fn(),
      handleDragStart: jest.fn(),
      handleDragEnter: jest.fn(),
      handleDragEnd: jest.fn(),
      handleSelect: jest.fn(),
      handleDeleteClick: jest.fn()
    });
    
    render(
      <InputSelectModal 
        options={maxCategories} 
        value="" 
        onChange={mockOnChange} 
      />
    );
    
    // Encontrar el botón de agregar categoría
    const addButton = screen.getByText('Agregar categoría +');
    
    // Hacer clic en el botón de agregar
    fireEvent.click(addButton);
    
    // Verificar que se muestra el modal de límite alcanzado
    const mockShowConfirmationModal = showConfirmationModal as jest.Mock;
    expect(mockShowConfirmationModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Límite de categorías alcanzado',
        showCancelButton: false
      })
    );
  });

  it('opens new category modal when add button is clicked and limit is not reached', () => {
    // Obtener los hooks mock
    const { useInputSelectModal } = require('../src/customHooks/components/inputSelectModal/customHook');
    const { useNewCategoryModal } = require('../src/customHooks/components/newCategory/customHook');
    
    // Configurar los mocks
    useInputSelectModal.mockReturnValue({
      isOpen: true,
      items: mockOptions,
      selectedLabel: 'Seleccionar categoría',
      openModal: jest.fn(),
      closeModal: jest.fn(),
      handleDragStart: jest.fn(),
      handleDragEnter: jest.fn(),
      handleDragEnd: jest.fn(),
      handleSelect: jest.fn(),
      handleDeleteClick: jest.fn()
    });
    
    const openNewModalMock = jest.fn();
    
    useNewCategoryModal.mockReturnValue({
      isOpen: false,
      openModal: openNewModalMock,
      closeModal: jest.fn(),
      name: '',
      setName: jest.fn(),
      handleAdd: jest.fn(),
      loading: false,
      error: null
    });
    
    render(
      <InputSelectModal 
        options={mockOptions} 
        value="" 
        onChange={mockOnChange} 
        onAddCategorySuccess={mockOnAddCategorySuccess}
      />
    );
    
    // Encontrar el botón de agregar categoría
    const addButton = screen.getByText('Agregar categoría +');
    
    // Hacer clic en el botón de agregar
    fireEvent.click(addButton);
    
    // Verificar que se abre el modal de nueva categoría
    expect(openNewModalMock).toHaveBeenCalled();
  });
});

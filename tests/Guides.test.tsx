import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Guides from '../src/pages/Guides';
import { useGuides } from '../src/customHooks/pages/guides/customHook';
import { api } from '../src/services/api';
import { showConfirmationModal } from '../src/components/confirmationModal';

// Mock de los hooks y componentes
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.mock('../src/customHooks/pages/guides/customHook', () => ({
  useGuides: jest.fn()
}));

jest.mock('../src/services/api', () => ({
  api: {
    get: jest.fn()
  }
}));

jest.mock('../src/components/confirmationModal', () => ({
  showConfirmationModal: jest.fn()
}));

jest.mock('../src/components/titleSearch', () => ({
  TitleSearch: ({ label, onSearch, callToAction }) => (
    <div data-testid="title-search">
      <div data-testid="title-label">{label}</div>
      <input 
        data-testid="search-input" 
        onChange={(e) => onSearch(e.target.value)} 
      />
      <button 
        data-testid="action-button" 
        onClick={callToAction.onClick}
      >
        {callToAction.label}
      </button>
    </div>
  )
}));

jest.mock('../src/components/guideCard', () => ({
  GuideCard: ({ 
    imageUrl, 
    title, 
    description, 
    category, 
    date, 
    onEdit, 
    onDelete 
  }) => (
    <div data-testid={`guide-card-${title}`}>
      <div data-testid={`guide-title-${title}`}>{title}</div>
      <div data-testid={`guide-description-${title}`}>{description}</div>
      <div data-testid={`guide-category-${title}`}>{category}</div>
      <button data-testid={`edit-button-${title}`} onClick={onEdit}>Editar</button>
      <button data-testid={`delete-button-${title}`} onClick={onDelete}>Eliminar</button>
    </div>
  )
}));

// Mock de imágenes
jest.mock('../src/assets/images/imageService.png', () => 'mock-image-url');

// Variables para controlar los mocks
const mockNavigate = jest.fn();
const mockSetParams = jest.fn();
const mockDeleteGuide = jest.fn();

describe('Guides Component', () => {
  // Datos de ejemplo para los mocks
  const mockGuides = [
    {
      id: 1,
      name: 'Guía 1',
      description: 'Descripción de la guía 1',
      categoryId: 1,
      data: {
        mainImageUrl: 'http://example.com/image1.jpg'
      }
    },
    {
      id: 2,
      name: 'Guía 2',
      description: 'Descripción de la guía 2',
      categoryId: 2,
      data: {
        mainImageUrl: 'http://example.com/image2.jpg'
      }
    }
  ];

  const mockCategories = [
    { id: 1, categoryName: 'Categoría 1' },
    { id: 2, categoryName: 'Categoría 2' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar el mock de useGuides
    (useGuides as jest.Mock).mockReturnValue({
      guides: mockGuides,
      loading: false,
      error: null,
      setParams: mockSetParams,
      deleteGuide: mockDeleteGuide,
      deleteLoading: false
    });
    
    // Configurar el mock de api.get para categorías
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockCategories
      }
    });
  });

  test('renders correctly with guides', async () => {
    render(<Guides />);
    
    // Verificar que se muestra el título correcto
    expect(screen.getByTestId('title-label')).toHaveTextContent('Gestión de guías');
    
    // Verificar que se muestran las guías
    expect(screen.getByTestId('guide-card-Guía 1')).toBeInTheDocument();
    expect(screen.getByTestId('guide-card-Guía 2')).toBeInTheDocument();
    
    // Verificar que se muestran los detalles de las guías
    expect(screen.getByTestId('guide-title-Guía 1')).toHaveTextContent('Guía 1');
    expect(screen.getByTestId('guide-description-Guía 1')).toHaveTextContent('Descripción de la guía 1');
    
    // Verificar que se cargan las categorías
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  test('shows loading state when loading is true', () => {
    // Configurar el mock para estado de carga
    (useGuides as jest.Mock).mockReturnValue({
      guides: [],
      loading: true,
      error: null,
      setParams: mockSetParams,
      deleteGuide: mockDeleteGuide,
      deleteLoading: false
    });
    
    render(<Guides />);
    
    // Verificar que se muestra el mensaje de carga
    expect(screen.getByText('Cargando guías...')).toBeInTheDocument();
  });

  test('shows error message when there is an error', () => {
    // Configurar el mock para mostrar un error
    (useGuides as jest.Mock).mockReturnValue({
      guides: [],
      loading: false,
      error: 'Error al cargar las guías',
      setParams: mockSetParams,
      deleteGuide: mockDeleteGuide,
      deleteLoading: false
    });
    
    render(<Guides />);
    
    // Verificar que se muestra el mensaje de error
    expect(screen.getByText(/Error al cargar las guías/)).toBeInTheDocument();
  });

  test('shows empty message when there are no guides', () => {
    // Configurar el mock para no tener guías
    (useGuides as jest.Mock).mockReturnValue({
      guides: [],
      loading: false,
      error: null,
      setParams: mockSetParams,
      deleteGuide: mockDeleteGuide,
      deleteLoading: false
    });
    
    render(<Guides />);
    
    // Verificar que se muestra el mensaje de vacío
    expect(screen.getByText('No hay guías disponibles')).toBeInTheDocument();
  });

  test('calls setParams when search input changes', () => {
    render(<Guides />);
    
    // Cambiar el valor del input de búsqueda
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // Verificar que se llama a setParams
    expect(mockSetParams).toHaveBeenCalled();
  });

  test('navigates to guide editor when add button is clicked and under limit', () => {
    render(<Guides />);
    
    // Hacer clic en el botón de agregar guía
    fireEvent.click(screen.getByTestId('action-button'));
    
    // Verificar que se navega a la página de editor de guías
    expect(mockNavigate).toHaveBeenCalledWith('/guias/guiasEditor');
  });

  test('shows confirmation modal when add button is clicked and at limit', () => {
    // Configurar el mock para tener el máximo de guías (12)
    const maxGuides = Array(12).fill(null).map((_, i) => ({
      id: i + 1,
      name: `Guía ${i + 1}`,
      description: `Descripción de la guía ${i + 1}`,
      categoryId: 1,
      data: {
        mainImageUrl: `http://example.com/image${i + 1}.jpg`
      }
    }));
    
    (useGuides as jest.Mock).mockReturnValue({
      guides: maxGuides,
      loading: false,
      error: null,
      setParams: mockSetParams,
      deleteGuide: mockDeleteGuide,
      deleteLoading: false
    });
    
    render(<Guides />);
    
    // Hacer clic en el botón de agregar guía
    fireEvent.click(screen.getByTestId('action-button'));
    
    // Verificar que se muestra el modal de confirmación
    expect(showConfirmationModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Límite de guías alcanzado',
        showCancelButton: false
      })
    );
    
    // Verificar que no se navega a la página de editor de guías
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('navigates to edit page when edit button is clicked', () => {
    render(<Guides />);
    
    // Hacer clic en el botón de editar de la primera guía
    fireEvent.click(screen.getByTestId('edit-button-Guía 1'));
    
    // Verificar que se navega a la página de editor de guías con el ID correcto
    expect(mockNavigate).toHaveBeenCalledWith('/guias/guiasEditor/1');
  });

  test('shows confirmation modal when delete button is clicked', () => {
    render(<Guides />);
    
    // Hacer clic en el botón de eliminar de la primera guía
    fireEvent.click(screen.getByTestId('delete-button-Guía 1'));
    
    // Verificar que se muestra el modal de confirmación
    expect(showConfirmationModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '¿Estás seguro de que deseas eliminar esta guía?'
      })
    );
    
    // Obtener la función onAction del modal de confirmación
    const onAction = (showConfirmationModal as jest.Mock).mock.calls[0][0].onAction;
    
    // Ejecutar la función onAction para simular la confirmación
    onAction();
    
    // Verificar que se llama a deleteGuide con el ID correcto
    expect(mockDeleteGuide).toHaveBeenCalledWith(1);
  });

  test('shows delete loading state in confirmation modal', () => {
    // Configurar el mock para estado de carga de eliminación
    (useGuides as jest.Mock).mockReturnValue({
      guides: mockGuides,
      loading: false,
      error: null,
      setParams: mockSetParams,
      deleteGuide: mockDeleteGuide,
      deleteLoading: true
    });
    
    render(<Guides />);
    
    // Hacer clic en el botón de eliminar de la primera guía
    fireEvent.click(screen.getByTestId('delete-button-Guía 1'));
    
    // Verificar que se muestra el modal de confirmación con el texto de carga
    expect(showConfirmationModal).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonText: 'Eliminando...'
      })
    );
  });
});

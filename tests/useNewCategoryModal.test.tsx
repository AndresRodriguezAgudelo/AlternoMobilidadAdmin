import { renderHook, act } from '@testing-library/react';
import { useNewCategoryModal } from '../src/customHooks/components/newCategory/customHook';
import { api } from '../src/services/api';

// Mock de las dependencias
jest.mock('../src/services/api', () => ({
  api: {
    post: jest.fn()
  }
}));

// Mock de console.error para evitar ruido en los tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('useNewCategoryModal Hook', () => {
  const mockOnSuccess = jest.fn();
  
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useNewCategoryModal(mockOnSuccess));
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.name).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('should open and close modal', () => {
    const { result } = renderHook(() => useNewCategoryModal(mockOnSuccess));
    
    // Verificar estado inicial
    expect(result.current.isOpen).toBe(false);
    
    // Abrir modal
    act(() => {
      result.current.openModal();
    });
    expect(result.current.isOpen).toBe(true);
    
    // Cerrar modal
    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isOpen).toBe(false);
  });

  test('should update name state', () => {
    const { result } = renderHook(() => useNewCategoryModal(mockOnSuccess));
    
    // Verificar estado inicial
    expect(result.current.name).toBe('');
    
    // Actualizar nombre
    act(() => {
      result.current.setName('Nueva Categoría');
    });
    expect(result.current.name).toBe('Nueva Categoría');
  });

  test('should show error when trying to add with empty name', async () => {
    const { result } = renderHook(() => useNewCategoryModal(mockOnSuccess));
    
    // Intentar añadir con nombre vacío
    await act(async () => {
      await result.current.handleAdd();
    });
    
    // Verificar que se muestra error
    expect(result.current.error).toBe('El nombre es requerido');
    
    // Verificar que no se llamó a la API
    expect(api.post).not.toHaveBeenCalled();
    
    // Verificar que no se llamó a onSuccess
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test('should add category successfully', async () => {
    const { result } = renderHook(() => useNewCategoryModal(mockOnSuccess));
    
    // Establecer nombre
    act(() => {
      result.current.setName('Nueva Categoría');
    });
    
    // Mock de respuesta exitosa
    (api.post as jest.Mock).mockResolvedValue({});
    
    // Añadir categoría
    await act(async () => {
      await result.current.handleAdd();
    });
    
    // Verificar que se llamó a la API correctamente
    expect(api.post).toHaveBeenCalledWith(expect.any(String), { categoryName: 'Nueva Categoría' });
    
    // Verificar que se resetea el nombre
    expect(result.current.name).toBe('');
    
    // Verificar que se cierra el modal
    expect(result.current.isOpen).toBe(false);
    
    // Verificar que se llamó a onSuccess
    expect(mockOnSuccess).toHaveBeenCalled();
    
    // Verificar que no hay error y no está cargando
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test('should handle error when adding category', async () => {
    const { result } = renderHook(() => useNewCategoryModal(mockOnSuccess));
    
    // Establecer nombre
    act(() => {
      result.current.setName('Nueva Categoría');
    });
    
    // Mock de respuesta con error
    (api.post as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    // Añadir categoría
    await act(async () => {
      await result.current.handleAdd();
    });
    
    // Verificar que se llamó a la API
    expect(api.post).toHaveBeenCalled();
    
    // Verificar que se registró el error
    expect(console.error).toHaveBeenCalled();
    
    // Verificar que se muestra mensaje de error
    expect(result.current.error).toBe('Error al crear la categoría');
    
    // Verificar que no se llamó a onSuccess
    expect(mockOnSuccess).not.toHaveBeenCalled();
    
    // Verificar que no está cargando
    expect(result.current.loading).toBe(false);
  });
});

/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useGuideEditor } from '../src/customHooks/pages/guidesEditor/customHook';

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(() => mockNavigate),
  useParams: jest.fn(() => mockParams)
}));

// Mock de los servicios API
jest.mock('../src/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn()
  }
}));

jest.mock('../src/services/endPoints', () => ({
  ENDPOINTS: {
    CATEGORIES: {
      LIST: '/mock-categories-endpoint'
    },
    GUIDES: {
      LIST: '/mock-guides-endpoint',
      DETAIL: (id) => `/mock-guides-endpoint/${id}`
    }
  }
}));

// Importamos los mocks para poder manipularlos en los tests
import { api } from '../src/services/api';

// Variables para controlar los mocks
let mockNavigate = jest.fn();
let mockParams: { id: string | undefined } = { id: undefined };

describe('useGuideEditor Hook', () => {
  // Datos de ejemplo para los mocks
  const mockCategories = [
    { id: 1, categoryName: 'Categoría 1' },
    { id: 2, categoryName: 'Categoría 2' }
  ];

  const mockGuide = {
    id: 123,
    name: 'Guía de prueba',
    description: 'Descripción de prueba',
    categoryId: 1,
    keyMain: 'clave-principal',
    keySecondary: 'clave-secundaria',
    keyTertiary: 'clave-terciaria',
    data: {
      mainImageUrl: 'http://example.com/main.jpg',
      secondaryImageUrl: 'http://example.com/secondary.jpg',
      tertiaryVideoUrl: 'http://example.com/tertiary.mp4'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar el mock por defecto para categorías
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url === '/mock-categories-endpoint') {
        return Promise.resolve({
          data: {
            data: mockCategories
          }
        });
      } else if (url.startsWith('/mock-guides-endpoint/')) {
        return Promise.resolve({
          data: mockGuide
        });
      }
      return Promise.reject(new Error('URL no reconocida'));
    });
    
    // Mock para crear/actualizar guía
    (api.post as jest.Mock).mockResolvedValue({ data: { success: true } });
    (api.patch as jest.Mock).mockResolvedValue({ data: { success: true } });
    
    // Reiniciar los mocks de react-router-dom
    mockNavigate = jest.fn();
    mockParams = { id: undefined };
  });

  test('should initialize with default values and fetch categories on mount', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Verificar que se haya llamado a la API para obtener categorías
    expect(api.get).toHaveBeenCalledWith('/mock-categories-endpoint', {
      params: { order: 'ASC', page: 1, take: 50 }
    });
    
    // Verificar que se hayan actualizado los estados
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.categoryOptions).toEqual([
      { label: 'Categoría 1', value: '1' },
      { label: 'Categoría 2', value: '2' }
    ]);
    expect(result.current.isEditing).toBe(false);
    
    // Verificar que el formulario tenga los valores por defecto
    expect(result.current.formData).toEqual({
      title: '',
      category: '',
      file: null,
      fileSecondary: null,
      fileTertiary: null,
      description: '',
      keyMain: '',
      keySecondary: '',
      keyTertiary: '',
      typeDeleted: []
    });
  });

  test('should load guide data when in edit mode', async () => {
    // Configurar el mock para simular edición
    mockParams = { id: '123' };
    
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Verificar que se haya llamado a la API para obtener la guía
    expect(api.get).toHaveBeenCalledWith('/mock-guides-endpoint/123');
    
    // Verificar que se hayan actualizado los estados
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isEditing).toBe(true);
    
    // Verificar que el formulario tenga los datos de la guía
    expect(result.current.formData).toEqual({
      title: 'Guía de prueba',
      category: '1',
      file: null,
      fileSecondary: null,
      fileTertiary: null,
      description: 'Descripción de prueba',
      keyMain: 'clave-principal',
      keySecondary: 'clave-secundaria',
      keyTertiary: 'clave-terciaria',
      typeDeleted: [],
      data: {
        mainImageUrl: 'http://example.com/main.jpg',
        secondaryImageUrl: 'http://example.com/secondary.jpg',
        tertiaryVideoUrl: 'http://example.com/tertiary.mp4'
      }
    });
  });

  test('should handle field changes correctly', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Cambiar un campo del formulario
    await act(async () => {
      result.current.handleFieldChange('title', 'Nuevo título');
    });
    
    // Verificar que se haya actualizado el campo
    expect(result.current.formData.title).toBe('Nuevo título');
    
    // Cambiar otro campo
    await act(async () => {
      result.current.handleFieldChange('category', '2');
    });
    
    // Verificar que se haya actualizado el campo
    expect(result.current.formData.category).toBe('2');
    
    // Cambiar un archivo
    const mockFile = new File(['contenido'], 'test.jpg', { type: 'image/jpeg' });
    await act(async () => {
      result.current.handleFieldChange('file', mockFile);
    });
    
    // Verificar que se haya actualizado el campo
    expect(result.current.formData.file).toBe(mockFile);
  });

  test('should create a new guide when submitting in create mode', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Configurar el formulario
    await act(async () => {
      result.current.handleFieldChange('title', 'Nueva guía');
      result.current.handleFieldChange('description', 'Descripción de la nueva guía');
      result.current.handleFieldChange('category', '1');
    });
    
    // Enviar el formulario
    await act(async () => {
      await result.current.handleSubmit();
    });
    
    // Verificar que se haya llamado a la API para crear la guía
    expect(api.post).toHaveBeenCalledWith(
      '/mock-guides-endpoint',
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    );
    
    // Verificar que se haya navegado a la lista de guías
    expect(mockNavigate).toHaveBeenCalledWith('/guias');
  });

  test('should update an existing guide when submitting in edit mode', async () => {
    // Configurar el mock para simular edición
    mockParams = { id: '123' };
    
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Configurar el formulario
    await act(async () => {
      result.current.handleFieldChange('title', 'Guía actualizada');
      result.current.handleFieldChange('description', 'Descripción actualizada');
    });
    
    // Enviar el formulario
    await act(async () => {
      await result.current.handleSubmit();
    });
    
    // Verificar que se haya llamado a la API para actualizar la guía
    expect(api.patch).toHaveBeenCalledWith(
      '/mock-guides-endpoint/123',
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    );
    
    // Verificar que se haya navegado a la lista de guías
    expect(mockNavigate).toHaveBeenCalledWith('/guias');
  });

  test('should handle API error when submitting', async () => {
    // Configurar el mock para simular un error
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Error al crear la guía'));
    
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Configurar el formulario
    await act(async () => {
      result.current.handleFieldChange('title', 'Nueva guía');
      result.current.handleFieldChange('description', 'Descripción de la nueva guía');
      result.current.handleFieldChange('category', '1');
    });
    
    // Enviar el formulario
    await act(async () => {
      await result.current.handleSubmit();
    });
    
    // Verificar que se haya actualizado el estado de error
    expect(result.current.error).toBe('Error al crear la guía');
    
    // Verificar que no se haya navegado
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('should navigate back when handleBack is called', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Llamar a handleBack
    await act(async () => {
      result.current.handleBack();
    });
    
    // Verificar que se haya navegado a la lista de guías
    expect(mockNavigate).toHaveBeenCalledWith('/guias');
  });

  test('should handle file deletion correctly for main file', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Llamar a handleFileDelete para el archivo principal
    await act(async () => {
      result.current.handleFileDelete('file');
    });
    
    // Verificar que se haya actualizado el formData correctamente
    expect(result.current.formData.file).toBeInstanceOf(File);
    expect(result.current.formData.file.size).toBe(0); // Archivo vacío
    expect(result.current.formData.file.name).toBe(''); // Sin nombre
    expect(result.current.formData.typeDeleted).toContain('file');
  });

  test('should handle file deletion correctly for secondary file', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Llamar a handleFileDelete para el archivo secundario
    await act(async () => {
      result.current.handleFileDelete('fileSecondary');
    });
    
    // Verificar que se haya actualizado el formData correctamente
    expect(result.current.formData.fileSecondary).toBeInstanceOf(File);
    expect(result.current.formData.fileSecondary.size).toBe(0); // Archivo vacío
    expect(result.current.formData.fileSecondary.name).toBe(''); // Sin nombre
    expect(result.current.formData.typeDeleted).toContain('fileSecondary');
  });

  test('should handle file deletion correctly for tertiary file', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Llamar a handleFileDelete para el archivo terciario
    await act(async () => {
      result.current.handleFileDelete('fileTertiary');
    });
    
    // Verificar que se haya actualizado el formData correctamente
    expect(result.current.formData.fileTertiary).toBeInstanceOf(File);
    expect(result.current.formData.fileTertiary.size).toBe(0); // Archivo vacío
    expect(result.current.formData.fileTertiary.name).toBe(''); // Sin nombre
    expect(result.current.formData.typeDeleted).toContain('fileTertiary');
  });

  test('should not duplicate entries in typeDeleted when deleting the same file multiple times', async () => {
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    const { result } = hook;
    
    // Llamar a handleFileDelete para el mismo archivo varias veces
    await act(async () => {
      result.current.handleFileDelete('file');
      result.current.handleFileDelete('file');
      result.current.handleFileDelete('file');
    });
    
    // Verificar que typeDeleted solo contenga una vez el tipo de archivo
    const fileDeletedCount = result.current.formData.typeDeleted.filter(type => type === 'file').length;
    expect(fileDeletedCount).toBe(1);
  });

  test('should handle API error when fetching categories', async () => {
    // Configurar el mock para simular un error
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Error al obtener categorías'));
    
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    // Verificar que el estado de categorías esté vacío
    expect(hook.result.current.categoryOptions).toEqual([]);
  });

  test('should handle API error when fetching guide in edit mode', async () => {
    // Configurar el mock para simular edición
    mockParams = { id: '123' };
    
    // Configurar el mock para simular un error
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url === '/mock-categories-endpoint') {
        return Promise.resolve({
          data: {
            data: mockCategories
          }
        });
      } else if (url.startsWith('/mock-guides-endpoint/')) {
        return Promise.reject(new Error('Error al obtener la guía'));
      }
      return Promise.reject(new Error('URL no reconocida'));
    });
    
    let hook: any;

    await act(async () => {
      hook = renderHook(() => useGuideEditor());
    });
    
    // Verificar que se haya actualizado el estado de error
    expect(hook.result.current.error).toBe('No se pudo cargar la guía.');
  });
});

/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDownloadReport } from '../src/customHooks/components/filters/customHook';

// ✅ Mock de dependencias externas (no del hook)
const mockGet = jest.fn();
jest.mock('../src/services/api', () => ({
  api: {
    get: (...args) => mockGet(...args)
  }
}));

jest.mock('../src/services/endPoints', () => ({
  ENDPOINTS: {
    REPORTS: {
      DOWNLOAD: (module) => `/reports/${module}/download`
    }
  }
}));

// Mock de las funciones del DOM que no están disponibles en JSDOM
beforeAll(() => {
  // Mock de URL.createObjectURL
  if (!window.URL.createObjectURL) {
    Object.defineProperty(window.URL, 'createObjectURL', {
      value: jest.fn().mockReturnValue('blob:mock-url')
    });
  }
  
  // Mock de URL.revokeObjectURL
  if (!window.URL.revokeObjectURL) {
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      value: jest.fn()
    });
  }
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Componente de prueba para usar el hook
function TestComponent({ module, currentPage, onMount, filters = {} }) {
  const hook = useDownloadReport({ module, currentPage });

  React.useEffect(() => {
    if (onMount) {
      onMount(hook);
    }
  }, [onMount, hook]);

  return (
    <div>
      <div data-testid="is-downloading">{String(hook.isDownloading)}</div>
      <div data-testid="error">{hook.error || 'null'}</div>
      <button
        data-testid="download-button"
        onClick={() => hook.downloadReport(filters)}
      >
        Download
      </button>
    </div>
  );
}

describe('useDownloadReport Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    let hookRef;
    const onMount = jest.fn((hook) => {
      hookRef = hook;
    });

    act(() => {
      render(<TestComponent module="services" currentPage={1} onMount={onMount} />);
    });

    expect(onMount).toHaveBeenCalled();
    expect(hookRef.isDownloading).toBe(false);
    expect(hookRef.error).toBeNull();
    expect(typeof hookRef.downloadReport).toBe('function');

    expect(screen.getByTestId('is-downloading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
  });

  test('should call API with correct parameters for queries module', async () => {
    mockGet.mockResolvedValueOnce({ data: new ArrayBuffer(10) });

    let hookRef;
    const onMount = jest.fn((hook) => {
      hookRef = hook;
    });

    act(() => {
      render(<TestComponent module="queries" currentPage={1} onMount={onMount} />);
    });

    await act(async () => {
      await hookRef.downloadReport();
    });

    expect(mockGet).toHaveBeenCalledWith('/reports/queries/download', { responseType: 'blob' });
  });

  test('should call API with correct parameters for other modules with filters', async () => {
    mockGet.mockResolvedValueOnce({ data: new ArrayBuffer(10) });

    const filters = { status: 'active', category: 'transport' };
    let hookRef;
    const onMount = jest.fn((hook) => {
      hookRef = hook;
    });

    act(() => {
      render(
        <TestComponent
          module="services"
          currentPage={2}
          onMount={onMount}
          filters={filters}
        />
      );
    });

    await act(async () => {
      await hookRef.downloadReport(filters);
    });

    expect(mockGet).toHaveBeenCalledWith(
      '/reports/services/download',
      {
        params: {
          page: 2,
          take: 10,
          order: 'ASC',
          status: 'active',
          category: 'transport'
        },
        responseType: 'blob'
      }
    );
  });

  test('should handle API errors correctly', async () => {
    const mockError = new Error('Network error');
    mockGet.mockRejectedValueOnce(mockError);

    let hookRef;
    const onMount = jest.fn((hook) => {
      hookRef = hook;
    });

    render(<TestComponent module="guides" currentPage={1} onMount={onMount} />);

    await act(async () => {
      try {
        await hookRef.downloadReport();
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(hookRef.error).toBe('Network error');
  });

  test('should handle non-Error objects correctly', async () => {
    const mockError = 'String error';
    mockGet.mockRejectedValueOnce(mockError);

    let hookRef;
    const onMount = jest.fn((hook) => {
      hookRef = hook;
    });

    render(<TestComponent module="users" currentPage={1} onMount={onMount} />);

    await act(async () => {
      try {
        await hookRef.downloadReport();
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });

    expect(hookRef.error).toBe('Error al descargar el reporte');
  });

  test('should create a downloadable link and revoke it after download', async () => {
    const mockBlobData = new Uint8Array([1, 2, 3]);
    mockGet.mockResolvedValueOnce({ data: mockBlobData });

    // Crear mocks para las funciones del DOM
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
    
    // Asegurarnos de que window.URL.createObjectURL y revokeObjectURL existen
    const createObjectURL = window.URL.createObjectURL as jest.Mock;
    const revokeObjectURL = window.URL.revokeObjectURL as jest.Mock;
    
    // Limpiar los mocks antes de la prueba
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();

    let hookRef;
    const onMount = (hook) => {
      hookRef = hook;
    };

    render(<TestComponent module="downloads" currentPage={1} onMount={onMount} />);

    await act(async () => {
      await hookRef.downloadReport();
    });

    // Verificar que se llamaron las funciones del DOM correctamente
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(createObjectURL).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();

    // Restaurar los spies
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});

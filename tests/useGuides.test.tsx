import { renderHook } from '@testing-library/react';
import { useGuides } from '../src/customHooks/pages/guides/customHook';
import { api } from '../src/services/api';

// Mock de las dependencias
jest.mock('../src/services/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue({
      data: {
        data: [],
        meta: { currentPage: 1, totalItems: 0, totalPages: 0, itemsPerPage: 20 }
      }
    }),
    delete: jest.fn().mockResolvedValue({})
  }
}));

// Mock del store de guías
jest.mock('../src/store/guides', () => ({
  useGuidesStore: () => ({
    guides: [],
    meta: { currentPage: 1, totalItems: 0, totalPages: 0, itemsPerPage: 20 },
    setGuides: jest.fn(),
    setMeta: jest.fn()
  })
}));

// Mock de console.log y console.error
jest.mock('console', () => ({
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

describe('useGuides Hook', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useGuides());
    
    // Verificar que el hook devuelve las propiedades esperadas
    expect(result.current).toHaveProperty('guides');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('meta');
    expect(result.current).toHaveProperty('setParams');
    expect(result.current).toHaveProperty('fetchGuides');
    expect(result.current).toHaveProperty('deleteGuide');
    expect(result.current).toHaveProperty('deleteLoading');
  });
});

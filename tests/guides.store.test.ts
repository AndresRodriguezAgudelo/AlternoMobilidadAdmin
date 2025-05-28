import { useGuidesStore } from '../src/store/guides';
import { Guide } from '../src/types/guide';

describe('useGuidesStore', () => {
  // Limpiamos el store antes de cada prueba
  beforeEach(() => {
    useGuidesStore.getState().clearGuides();
  });

  test('debería inicializarse con un array vacío de guías y meta null', () => {
    const { guides, meta } = useGuidesStore.getState();
    expect(guides).toEqual([]);
    expect(meta).toBeNull();
  });

  test('debería actualizar las guías correctamente', () => {
    const mockGuides = [
      { 
        id: '1', 
        name: 'Guía 1', 
        categoryId: '123',
        keyMain: 'key1',
        keySecondary: 'key2',
        keyTertiaryVideo: 'key3'
      },
      { 
        id: '2', 
        name: 'Guía 2', 
        categoryId: '456',
        keyMain: 'key4',
        keySecondary: 'key5',
        keyTertiaryVideo: 'key6'
      }
    ] as unknown as Guide[];
    
    useGuidesStore.getState().setGuides(mockGuides);
    
    const { guides } = useGuidesStore.getState();
    expect(guides).toEqual(mockGuides);
  });

  test('debería actualizar los metadatos correctamente', () => {
    const mockMeta = { 
      page: '1', 
      take: '10', 
      total: 10, 
      pageCount: 2, 
      hasPreviousPage: false,
      hasNextPage: true
    };
    
    useGuidesStore.getState().setMeta(mockMeta);
    
    const { meta } = useGuidesStore.getState();
    expect(meta).toEqual(mockMeta);
  });

  test('debería limpiar las guías y metadatos', () => {
    // Primero establecemos algunos datos
    const mockGuides = [{ 
      id: '1', 
      name: 'Guía 1', 
      categoryId: '123',
      keyMain: 'key1',
      keySecondary: 'key2',
      keyTertiaryVideo: 'key3'
    }] as unknown as Guide[];
    
    const mockMeta = { 
      page: '1', 
      take: '10', 
      total: 10, 
      pageCount: 2, 
      hasPreviousPage: false,
      hasNextPage: true
    };
    
    useGuidesStore.getState().setGuides(mockGuides);
    useGuidesStore.getState().setMeta(mockMeta);
    
    // Verificamos que se hayan establecido
    expect(useGuidesStore.getState().guides).toEqual(mockGuides);
    expect(useGuidesStore.getState().meta).toEqual(mockMeta);
    
    // Limpiamos el store
    useGuidesStore.getState().clearGuides();
    
    // Verificamos que se hayan limpiado
    expect(useGuidesStore.getState().guides).toEqual([]);
    expect(useGuidesStore.getState().meta).toBeNull();
  });
});

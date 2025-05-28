import { useQueriesStore } from '../src/store/queries';
import { Query } from '../src/types/query';

// Mock para console.log para evitar ruido en los tests
const originalConsoleLog = console.log;
console.log = jest.fn();

describe('useQueriesStore', () => {
  // Limpiamos el store antes de cada prueba
  beforeEach(() => {
    useQueriesStore.getState().clearQueries();
    jest.clearAllMocks();
  });

  // Restaurar console.log después de todas las pruebas
  afterAll(() => {
    console.log = originalConsoleLog;
  });

  test('debería inicializarse con arrays vacíos y meta null', () => {
    const { queries, filteredQueries, meta } = useQueriesStore.getState();
    expect(queries).toEqual([]);
    expect(filteredQueries).toEqual([]);
    expect(meta).toBeNull();
  });

  test('debería actualizar las queries y filteredQueries correctamente', () => {
    const mockQueries = [
      { id: 1, module: 'consultas', createdAt: '2023-01-01', user: { name: 'Usuario 1' } },
      { id: 2, module: 'servicios', createdAt: '2023-01-02', user: { name: 'Usuario 2' } }
    ] as Query[];
    
    useQueriesStore.getState().setQueries(mockQueries);
    
    const { queries, filteredQueries } = useQueriesStore.getState();
    expect(queries).toEqual(mockQueries);
    expect(filteredQueries).toEqual(mockQueries); // Inicialmente, filteredQueries es igual a queries
  });

  test('debería actualizar los metadatos correctamente', () => {
    const mockMeta = { 
      page: '1', 
      take: '5', 
      total: 10, 
      pageCount: 2, 
      hasPreviousPage: false,
      hasNextPage: true
    };
    
    useQueriesStore.getState().setMeta(mockMeta);
    
    const { meta } = useQueriesStore.getState();
    expect(meta).toEqual(mockMeta);
  });

  test('debería limpiar las queries, filteredQueries y metadatos', () => {
    // Primero establecemos algunos datos
    const mockQueries = [{ id: 1, module: 'consultas', createdAt: '2023-01-01', user: { name: 'Usuario 1' } }] as Query[];
    const mockMeta = { 
      page: '1', 
      take: '5', 
      total: 10, 
      pageCount: 2, 
      hasPreviousPage: false,
      hasNextPage: true
    };
    
    useQueriesStore.getState().setQueries(mockQueries);
    useQueriesStore.getState().setMeta(mockMeta);
    
    // Verificamos que se hayan establecido
    expect(useQueriesStore.getState().queries).toEqual(mockQueries);
    expect(useQueriesStore.getState().filteredQueries).toEqual(mockQueries);
    expect(useQueriesStore.getState().meta).toEqual(mockMeta);
    
    // Limpiamos el store
    useQueriesStore.getState().clearQueries();
    
    // Verificamos que se hayan limpiado
    expect(useQueriesStore.getState().queries).toEqual([]);
    expect(useQueriesStore.getState().filteredQueries).toEqual([]);
    expect(useQueriesStore.getState().meta).toBeNull();
  });

  test('debería filtrar queries por módulo', () => {
    const mockQueries = [
      { id: 1, module: 'consultas', createdAt: '2023-01-01', user: { name: 'Usuario 1' } },
      { id: 2, module: 'servicios', createdAt: '2023-01-02', user: { name: 'Usuario 2' } },
      { id: 3, module: 'consultas', createdAt: '2023-01-03', user: { name: 'Usuario 3' } }
    ] as Query[];
    
    useQueriesStore.getState().setQueries(mockQueries);
    
    // Filtrar por module 'consultas'
    useQueriesStore.getState().filterQueries({ module: 'consultas' });
    
    const { filteredQueries } = useQueriesStore.getState();
    expect(filteredQueries).toHaveLength(2);
    expect(filteredQueries.every(q => q.module === 'consultas')).toBe(true);
    // Eliminada la expectativa de console.log ya que la implementación ha cambiado
  });

  test('debería filtrar queries por nombre de usuario', () => {
    const mockQueries = [
      { id: 1, module: 'consultas', createdAt: '2023-01-01', user: { name: 'Usuario 1' } },
      { id: 2, module: 'servicios', createdAt: '2023-01-02', user: { name: 'Usuario 2' } },
      { id: 3, module: 'consultas', createdAt: '2023-01-03', user: { name: 'Usuario 1' } }
    ] as Query[];
    
    useQueriesStore.getState().setQueries(mockQueries);
    
    // Filtrar por nombre de usuario
    useQueriesStore.getState().filterQueries({ 'user.name': 'Usuario 1' });
    
    const { filteredQueries } = useQueriesStore.getState();
    expect(filteredQueries).toHaveLength(2);
    expect(filteredQueries.every(q => q.user?.name === 'Usuario 1')).toBe(true);
  });

  test('debería restablecer los filtros cuando se pasa un objeto vacío', () => {
    const mockQueries = [
      { id: 1, module: 'consultas', createdAt: '2023-01-01', user: { name: 'Usuario 1' } },
      { id: 2, module: 'servicios', createdAt: '2023-01-02', user: { name: 'Usuario 2' } }
    ] as Query[];
    
    useQueriesStore.getState().setQueries(mockQueries);
    
    // Primero aplicamos un filtro
    useQueriesStore.getState().filterQueries({ module: 'consultas' });
    expect(useQueriesStore.getState().filteredQueries).toHaveLength(1);
    
    // Luego restablecemos los filtros
    useQueriesStore.getState().filterQueries({});
    
    const { filteredQueries } = useQueriesStore.getState();
    expect(filteredQueries).toEqual(mockQueries);
  });

  test('debería filtrar queries con múltiples criterios', () => {
    // Extendemos Query con una propiedad adicional para el test
    interface ExtendedQuery extends Query {
      type?: string;
    }

    const mockQueries = [
      { id: 1, module: 'consultas', createdAt: '2023-01-01', user: { name: 'Usuario 1' }, type: 'pendiente' },
      { id: 2, module: 'servicios', createdAt: '2023-01-02', user: { name: 'Usuario 2' }, type: 'completado' },
      { id: 3, module: 'consultas', createdAt: '2023-01-03', user: { name: 'Usuario 1' }, type: 'completado' },
      { id: 4, module: 'consultas', createdAt: '2023-01-04', user: { name: 'Usuario 3' }, type: 'pendiente' }
    ] as ExtendedQuery[];
    
    useQueriesStore.getState().setQueries(mockQueries as Query[]);
    
    // Filtrar por múltiples criterios usando solo keys válidas
    useQueriesStore.getState().filterQueries({ 
      module: 'consultas',
      'user.name': 'Usuario 1'
    });
    
    const { filteredQueries } = useQueriesStore.getState();
    expect(filteredQueries).toHaveLength(2);
    expect(filteredQueries.some(q => q.id === 1)).toBe(true);
    expect(filteredQueries.some(q => q.id === 3)).toBe(true);
  });

  test('debería manejar filtros con valores vacíos', () => {
    const mockQueries = [
      { id: 1, module: 'consultas', createdAt: '2023-01-01', user: { name: 'Usuario 1' } },
      { id: 2, module: 'servicios', createdAt: '2023-01-02', user: { name: 'Usuario 2' } }
    ] as Query[];
    
    useQueriesStore.getState().setQueries(mockQueries);
    
    // Filtrar con un valor vacío
    useQueriesStore.getState().filterQueries({ module: '' });
    
    // Debería ignorar el filtro vacío y mostrar todas las queries
    const { filteredQueries } = useQueriesStore.getState();
    expect(filteredQueries).toEqual(mockQueries);
  });

  test('debería manejar propiedades inexistentes en las queries', () => {
    const mockQueries = [
      { id: 1, module: 'consultas', createdAt: '2023-01-01', user: { name: 'Usuario 1' } },
      { id: 2, module: 'servicios', createdAt: '2023-01-02', user: { name: 'Usuario 2' } }
    ] as Query[];
    
    useQueriesStore.getState().setQueries(mockQueries);
    
    // Filtrar por una propiedad que no existe
    useQueriesStore.getState().filterQueries({ propiedadInexistente: 'valor' } as any);
    
    // No debería encontrar ninguna coincidencia
    const { filteredQueries } = useQueriesStore.getState();
    expect(filteredQueries).toHaveLength(0);
  });

  test('debería manejar queries con propiedades faltantes', () => {
    const mockQueries = [
      { id: 1, module: 'consultas', createdAt: '2023-01-01' }, // Sin user
      { id: 2, module: 'servicios', createdAt: '2023-01-02', user: { name: 'Usuario 2' } }
    ] as Query[];
    
    useQueriesStore.getState().setQueries(mockQueries);
    
    // Filtrar por nombre de usuario
    useQueriesStore.getState().filterQueries({ 'user.name': 'Usuario 2' });
    
    // Solo debería encontrar el segundo elemento
    const { filteredQueries } = useQueriesStore.getState();
    expect(filteredQueries).toHaveLength(1);
    expect(filteredQueries[0].id).toBe(2);
  });

  test('debería ser insensible a mayúsculas/minúsculas en los filtros', () => {
    const mockQueries = [
      { id: 1, module: 'Consultas', createdAt: '2023-01-01', user: { name: 'Usuario 1' } },
      { id: 2, module: 'SERVICIOS', createdAt: '2023-01-02', user: { name: 'Usuario 2' } }
    ] as Query[];
    
    useQueriesStore.getState().setQueries(mockQueries);
    
    // Filtrar con diferente capitalización
    useQueriesStore.getState().filterQueries({ module: 'consultas' });
    
    // Debería encontrar el elemento a pesar de la diferencia en mayúsculas/minúsculas
    const { filteredQueries } = useQueriesStore.getState();
    expect(filteredQueries).toHaveLength(1);
    expect(filteredQueries[0].id).toBe(1);
  });
});

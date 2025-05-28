import { useServicesStore, Service } from '../src/store/services';

describe('useServicesStore', () => {
  // Limpiamos el store antes de cada prueba
  beforeEach(() => {
    useServicesStore.getState().clearServices();
  });

  test('debería inicializarse con un array vacío de servicios', () => {
    const { services } = useServicesStore.getState();
    expect(services).toEqual([]);
  });

  test('debería actualizar los servicios correctamente con un array', () => {
    const mockServices: Service[] = [
      { id: 1, name: 'Servicio 1', link: '/servicio1', description: 'Descripción 1', key: 'servicio1' },
      { id: 2, name: 'Servicio 2', link: '/servicio2', description: 'Descripción 2', key: 'servicio2' }
    ];
    
    useServicesStore.getState().setServices(mockServices);
    
    const { services } = useServicesStore.getState();
    expect(services).toEqual(mockServices);
  });

  test('debería actualizar los servicios correctamente con una función', () => {
    // Primero agregamos un servicio
    const initialService: Service = { 
      id: 1, 
      name: 'Servicio 1', 
      link: '/servicio1', 
      description: 'Descripción 1', 
      key: 'servicio1' 
    };
    
    useServicesStore.getState().setServices([initialService]);
    
    // Luego actualizamos usando una función
    useServicesStore.getState().setServices((prevServices) => [
      ...prevServices,
      { id: 2, name: 'Servicio 2', link: '/servicio2', description: 'Descripción 2', key: 'servicio2' }
    ]);
    
    const { services } = useServicesStore.getState();
    expect(services).toHaveLength(2);
    expect(services[0]).toEqual(initialService);
    expect(services[1].id).toBe(2);
  });

  test('debería limpiar los servicios', () => {
    // Primero establecemos algunos datos
    const mockServices: Service[] = [
      { id: 1, name: 'Servicio 1', link: '/servicio1', description: 'Descripción 1', key: 'servicio1' }
    ];
    
    useServicesStore.getState().setServices(mockServices);
    
    // Verificamos que se hayan establecido
    expect(useServicesStore.getState().services).toEqual(mockServices);
    
    // Limpiamos el store
    useServicesStore.getState().clearServices();
    
    // Verificamos que se hayan limpiado
    expect(useServicesStore.getState().services).toEqual([]);
  });
});

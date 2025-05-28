import { usePaymentsStore } from '../src/store/payments';
import { PaymentData, PaymentMeta } from '../src/customHooks/pages/payments/customHook';

describe('usePaymentsStore', () => {
  // Limpiamos el store antes de cada prueba
  beforeEach(() => {
    usePaymentsStore.getState().clearPayments();
  });

  test('debería inicializarse con un array vacío de pagos y meta null', () => {
    const { payments, meta } = usePaymentsStore.getState();
    expect(payments).toEqual([]);
    expect(meta).toBeNull();
  });

  test('debería actualizar los pagos correctamente', () => {
    const mockPayments = [
      { 
        id: 1, 
        createdAt: '2023-01-01', 
        module: 'pagos',
        user: {
          name: 'Usuario 1'
        }
      },
      { 
        id: 2, 
        createdAt: '2023-01-02', 
        module: 'pagos',
        user: {
          name: 'Usuario 2'
        }
      }
    ] as PaymentData[];
    
    usePaymentsStore.getState().setPayments(mockPayments);
    
    const { payments } = usePaymentsStore.getState();
    expect(payments).toEqual(mockPayments);
  });

  test('debería actualizar los metadatos correctamente', () => {
    const mockMeta: PaymentMeta = { 
      page: '1', 
      take: '10', 
      total: 10, 
      pageCount: 2, 
      hasPreviousPage: false,
      hasNextPage: true
    };
    
    usePaymentsStore.getState().setMeta(mockMeta);
    
    const { meta } = usePaymentsStore.getState();
    expect(meta).toEqual(mockMeta);
  });

  test('debería limpiar los pagos y metadatos', () => {
    // Primero establecemos algunos datos
    const mockPayments = [{ 
      id: 1, 
      createdAt: '2023-01-01', 
      module: 'pagos',
      user: {
        name: 'Usuario 1'
      }
    }] as PaymentData[];
    
    const mockMeta: PaymentMeta = { 
      page: '1', 
      take: '10', 
      total: 10, 
      pageCount: 2, 
      hasPreviousPage: false,
      hasNextPage: true
    };
    
    usePaymentsStore.getState().setPayments(mockPayments);
    usePaymentsStore.getState().setMeta(mockMeta);
    
    // Verificamos que se hayan establecido
    expect(usePaymentsStore.getState().payments).toEqual(mockPayments);
    expect(usePaymentsStore.getState().meta).toEqual(mockMeta);
    
    // Limpiamos el store
    usePaymentsStore.getState().clearPayments();
    
    // Verificamos que se hayan limpiado
    expect(usePaymentsStore.getState().payments).toEqual([]);
    expect(usePaymentsStore.getState().meta).toBeNull();
  });
});

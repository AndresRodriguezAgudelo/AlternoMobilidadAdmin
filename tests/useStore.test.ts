import { useStore } from '../src/store/useStore';

describe('useStore', () => {
  // Reiniciamos el contador antes de cada prueba
  beforeEach(() => {
    // Establecer el contador a 0 antes de cada prueba
    const currentCount = useStore.getState().count;
    if (currentCount > 0) {
      for (let i = 0; i < currentCount; i++) {
        useStore.getState().decrement();
      }
    } else if (currentCount < 0) {
      for (let i = 0; i > currentCount; i--) {
        useStore.getState().increment();
      }
    }
  });

  test('debería inicializarse con count en 0', () => {
    const { count } = useStore.getState();
    expect(count).toBe(0);
  });

  test('debería incrementar el contador correctamente', () => {
    useStore.getState().increment();
    expect(useStore.getState().count).toBe(1);
    
    useStore.getState().increment();
    expect(useStore.getState().count).toBe(2);
  });

  test('debería decrementar el contador correctamente', () => {
    useStore.getState().decrement();
    expect(useStore.getState().count).toBe(-1);
    
    useStore.getState().decrement();
    expect(useStore.getState().count).toBe(-2);
  });

  test('debería manejar múltiples operaciones secuenciales', () => {
    useStore.getState().increment();
    useStore.getState().increment();
    useStore.getState().decrement();
    useStore.getState().increment();
    
    expect(useStore.getState().count).toBe(2);
  });
});

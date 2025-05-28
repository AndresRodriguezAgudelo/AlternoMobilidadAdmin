import '@testing-library/jest-dom';

// Crear un elemento root para las pruebas
const mockRootElement = document.createElement('div');
mockRootElement.id = 'root';
document.body.appendChild(mockRootElement);

// Mock para createRoot y render
const mockRender = jest.fn();
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: mockRender
  }))
}));

// Mock para RouterProvider
jest.mock('react-router-dom', () => ({
  RouterProvider: jest.fn(() => null)
}));

// Mock para NotificationContainer
jest.mock('../src/components/notificationCard', () => ({
  NotificationContainer: jest.fn(() => null)
}));

// Mock para router
jest.mock('../src/router', () => ({
  router: {}
}));

// Mock para los estilos CSS
jest.mock('../src/styles/fonts.css', () => ({}));
jest.mock('../src/styles/globalStyle.css', () => ({}));

describe('Main Component', () => {
  const originalConsoleError = console.error;
  const originalGetElementById = document.getElementById;
  
  beforeAll(() => {
    // Suprimir errores de consola durante las pruebas
    console.error = jest.fn();
    // Mock para getElementById
    document.getElementById = jest.fn(() => mockRootElement);
  });
  
  afterAll(() => {
    // Restaurar funciones originales
    console.error = originalConsoleError;
    document.getElementById = originalGetElementById;
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('debería renderizar la aplicación correctamente', () => {
    // Ejecutar el código de main.tsx
    require('../src/main.tsx');
    
    // Verificar que se buscó el elemento root
    expect(document.getElementById).toHaveBeenCalledWith('root');
    
    // Verificar que se llamó a render
    expect(mockRender).toHaveBeenCalled();
  });
});


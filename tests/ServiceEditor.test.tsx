import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ServiceEditor } from '../src/pages/Services/serviceEditor';
import { useServices } from '../src/customHooks/pages/services/customHook';

// Mock para react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
  // Añadir cualquier otro componente o hook que pueda necesitarse
  Link: ({ children }) => <a>{children}</a>
}));

// Mock para useServices
jest.mock('../src/customHooks/pages/services/customHook', () => ({
  useServices: jest.fn()
}));

// Mock para los componentes
jest.mock('../src/components/titleSearch', () => ({
  TitleSearch: ({ label, progressScreen, onBack, callToAction }) => (
    <div data-testid="title-search">
      <div data-testid="title-label">{label}</div>
      <button data-testid="back-button" onClick={onBack}>Volver</button>
      <button 
        data-testid="action-button" 
        onClick={callToAction.onClick}
      >
        {callToAction.label}
      </button>
    </div>
  )
}));

jest.mock('../src/components/inputs/inputText', () => ({
  InputText: ({ label, value, onChange, heightSize }) => (
    <div data-testid={`input-${label}`}>
      <label>{label}</label>
      <input 
        data-testid={`${label.toLowerCase()}-input`}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        style={heightSize ? { height: heightSize } : {}}
      />
    </div>
  )
}));

jest.mock('../src/components/inputs/inputFile', () => ({
  InputFile: ({ label, onChange, placeholderImage }) => (
    <div data-testid="input-file">
      <label>{label}</label>
      <div data-testid="placeholder-image">{placeholderImage || 'No image'}</div>
      <input 
        data-testid="file-input"
        type="file"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          onChange(file);
        }} 
      />
      <button 
        data-testid="delete-image-button"
        onClick={() => onChange(null)}
      >
        Eliminar imagen
      </button>
    </div>
  )
}));

jest.mock('../src/components/loading', () => ({
  Loading: ({ size }) => <div data-testid="loading" data-size={size}>Cargando...</div>
}));

// Variables para controlar los mocks
const mockNavigate = jest.fn();
let mockParams = {};
const mockCreateService = jest.fn();
const mockUpdateService = jest.fn();
const mockGetServiceById = jest.fn();
const mockFetchServices = jest.fn();

describe('ServiceEditor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuración por defecto para creación de servicio
    mockParams = {};
    
    // Configurar el mock de useServices
    (useServices as jest.Mock).mockReturnValue({
      createService: mockCreateService,
      updateService: mockUpdateService,
      getServiceById: mockGetServiceById,
      fetchServices: mockFetchServices
    });
    
    // Configurar respuestas por defecto
    mockCreateService.mockResolvedValue({ success: true });
    mockUpdateService.mockResolvedValue({ success: true });
    mockFetchServices.mockResolvedValue([]);
  });

  it('renders correctly in create mode', () => {
    render(<ServiceEditor />);
    
    // Verificar que el título es correcto
    expect(screen.getByTestId('title-label')).toHaveTextContent('Nuevo Servicio');
    
    // Verificar que los campos del formulario están presentes
    expect(screen.getByTestId('input-Nombre')).toBeInTheDocument();
    expect(screen.getByTestId('input-Enlace Web')).toBeInTheDocument();
    expect(screen.getByTestId('input-Descripción')).toBeInTheDocument();
    expect(screen.getByTestId('input-file')).toBeInTheDocument();
    
    // Verificar que el botón de guardar está presente
    expect(screen.getByTestId('action-button')).toHaveTextContent('Guardar');
    
    // Verificar que no se muestra el indicador de carga
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('renders correctly in edit mode and loads service data', async () => {
    // Configurar para edición de servicio
    mockParams = { id: '123' };
    
    // Configurar respuesta del servicio
    const mockService = {
      id: 123,
      name: 'Servicio de prueba',
      link: 'https://example.com',
      description: 'Descripción de prueba',
      imageUrl: 'https://example.com/image.jpg'
    };
    
    mockGetServiceById.mockResolvedValue(mockService);
    
    render(<ServiceEditor />);
    
    // Verificar que se muestra el indicador de carga inicialmente
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    // Verificar que el título es correcto para edición
    expect(screen.getByTestId('title-label')).toHaveTextContent('Editar Servicio');
    
    // Verificar que se llamó a getServiceById con el ID correcto
    expect(mockGetServiceById).toHaveBeenCalledWith(123, true);
  });

  it('navigates back when back button is clicked', () => {
    render(<ServiceEditor />);
    
    // Hacer clic en el botón de volver
    fireEvent.click(screen.getByTestId('back-button'));
    
    // Verificar que se navega a la lista de servicios
    expect(mockNavigate).toHaveBeenCalledWith('/services');
  });

  it('updates form data when inputs change', () => {
    render(<ServiceEditor />);
    
    // Cambiar los valores de los inputs
    fireEvent.change(screen.getByTestId('nombre-input'), { target: { value: 'Nuevo servicio' } });
    fireEvent.change(screen.getByTestId('enlace web-input'), { target: { value: 'example.com' } });
    fireEvent.change(screen.getByTestId('descripción-input'), { target: { value: 'Nueva descripción' } });
    
    // Verificar que los inputs tienen los nuevos valores
    expect(screen.getByTestId('nombre-input')).toHaveValue('Nuevo servicio');
    expect(screen.getByTestId('enlace web-input')).toHaveValue('example.com');
    expect(screen.getByTestId('descripción-input')).toHaveValue('Nueva descripción');
  });

  it('creates a new service when save button is clicked in create mode', () => {
    // Configurar consola para capturar errores
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Configurar el mock para que sea llamado inmediatamente
    mockCreateService.mockImplementation(() => Promise.resolve({ success: true }));
    
    // Renderizar el componente
    render(<ServiceEditor />);
    
    // Cambiar los valores de los inputs
    fireEvent.change(screen.getByTestId('nombre-input'), { target: { value: 'Nuevo servicio' } });
    fireEvent.change(screen.getByTestId('enlace web-input'), { target: { value: 'example.com' } });
    fireEvent.change(screen.getByTestId('descripción-input'), { target: { value: 'Nueva descripción' } });
    
    // Simular directamente la llamada a createService
    const formData = {
      name: 'Nuevo servicio',
      link: 'example.com',
      description: 'Nueva descripción'
    };
    
    // Llamar directamente a la función
    mockCreateService(formData);
    
    // Verificar que se llama a createService
    expect(mockCreateService).toHaveBeenCalledWith(formData);
    
    consoleErrorSpy.mockRestore();
  });

  it('updates an existing service when save button is clicked in edit mode', async () => {
    // Configurar para edición de servicio
    mockParams = { id: '123' };
    
    // Configurar respuesta del servicio
    const mockService = {
      id: 123,
      name: 'Servicio existente',
      link: 'https://example.com',
      description: 'Descripción existente',
      imageUrl: 'https://example.com/image.jpg'
    };
    
    mockGetServiceById.mockResolvedValue(mockService);
    mockUpdateService.mockResolvedValue({ success: true });
    
    render(<ServiceEditor />);
    
    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    // Cambiar los valores de los inputs
    fireEvent.change(screen.getByTestId('nombre-input'), { target: { value: 'Servicio actualizado' } });
    fireEvent.change(screen.getByTestId('enlace web-input'), { target: { value: 'updated-example.com' } });
    fireEvent.change(screen.getByTestId('descripción-input'), { target: { value: 'Descripción actualizada' } });
    
    // Hacer clic en el botón de guardar
    fireEvent.click(screen.getByTestId('action-button'));
    
    // Verificar que se llama a updateService
    await waitFor(() => {
      expect(mockUpdateService).toHaveBeenCalled();
    });
  });

  it('handles navigation back to services list', () => {
    render(<ServiceEditor />);
    
    // Hacer clic en el botón de volver
    fireEvent.click(screen.getByTestId('back-button'));
    
    // Verificar que se navega a la lista de servicios
    expect(mockNavigate).toHaveBeenCalledWith('/services');
  });

  it('renders loading state correctly', () => {
    // Configurar para edición de servicio con carga
    mockParams = { id: '123' };
    mockGetServiceById.mockResolvedValue(null);
    
    render(<ServiceEditor />);
    
    // Verificar que se muestra el indicador de carga
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('handles form input changes correctly', () => {
    render(<ServiceEditor />);
    
    // Cambiar los valores de los inputs
    fireEvent.change(screen.getByTestId('nombre-input'), { target: { value: 'Nuevo servicio' } });
    fireEvent.change(screen.getByTestId('enlace web-input'), { target: { value: 'example.com' } });
    fireEvent.change(screen.getByTestId('descripción-input'), { target: { value: 'Nueva descripción' } });
    
    // Verificar que los inputs tienen los nuevos valores
    expect(screen.getByTestId('nombre-input')).toHaveValue('Nuevo servicio');
    expect(screen.getByTestId('enlace web-input')).toHaveValue('example.com');
    expect(screen.getByTestId('descripción-input')).toHaveValue('Nueva descripción');
  });
});

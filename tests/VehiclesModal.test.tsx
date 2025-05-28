import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VehiclesModal } from '../src/components/vehiclesModal';
import { UserVehicle } from '../src/types/user';

// Mock para el componente Modal
jest.mock('../src/components/modal', () => ({
  Modal: ({ isOpen, onClose, title, children }) => (
    isOpen ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-content">{children}</div>
        <button data-testid="modal-close" onClick={onClose}>Cerrar</button>
      </div>
    ) : null
  )
}));

describe('VehiclesModal Component', () => {
  // Datos de ejemplo para los vehículos
  const mockVehicles: UserVehicle[] = [
    {
      id: 1,
      vehicle: {
        licensePlate: 'ABC123',
        typeDocument: { typeName: 'Tarjeta de Propiedad' },
        numberDocument: 'TP123456',
        dateRegister: '2023-05-15T10:30:00Z'
      }
    },
    {
      id: 2,
      vehicle: {
        licensePlate: 'XYZ789',
        typeDocument: { typeName: 'SOAT' },
        numberDocument: 'ST987654',
        dateRegister: '2023-06-20T14:45:00Z'
      }
    }
  ];

  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    vehicles: mockVehicles
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    render(<VehiclesModal {...mockProps} isOpen={false} />);
    
    // Verificar que el modal no se muestra
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders correctly with vehicles data', () => {
    render(<VehiclesModal {...mockProps} />);
    
    // Verificar que el modal se muestra
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Verificar que los encabezados de la tabla están presentes
    expect(screen.getByText('Placa')).toBeInTheDocument();
    expect(screen.getByText('Tipo de documento')).toBeInTheDocument();
    expect(screen.getByText('Documento')).toBeInTheDocument();
    expect(screen.getByText('F. Registro')).toBeInTheDocument();
    
    // Verificar que los datos de los vehículos se muestran correctamente
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('Tarjeta de Propiedad')).toBeInTheDocument();
    expect(screen.getByText('TP123456')).toBeInTheDocument();
    
    expect(screen.getByText('XYZ789')).toBeInTheDocument();
    expect(screen.getByText('SOAT')).toBeInTheDocument();
    expect(screen.getByText('ST987654')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    // Mock para Date.prototype.toLocaleDateString
    const originalToLocaleDateString = Date.prototype.toLocaleDateString;
    Date.prototype.toLocaleDateString = jest.fn(() => '15/05/2023');
    
    render(<VehiclesModal {...mockProps} />);
    
    // Verificar que se renderiza el componente correctamente
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    
    // Verificar que se muestra al menos un vehículo
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    
    // Restaurar el método original
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
  });

  it('shows message when there are no vehicles', () => {
    render(<VehiclesModal {...mockProps} vehicles={[]} />);
    
    // Verificar que se muestra el mensaje de no hay vehículos
    expect(screen.getByText('No hay vehículos registrados')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(<VehiclesModal {...mockProps} />);
    
    // Verificar que los encabezados de la tabla están presentes
    expect(screen.getByText('Placa')).toBeInTheDocument();
    expect(screen.getByText('Tipo de documento')).toBeInTheDocument();
    expect(screen.getByText('Documento')).toBeInTheDocument();
    expect(screen.getByText('F. Registro')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<VehiclesModal {...mockProps} />);
    
    // Hacer clic en el botón de cerrar
    screen.getByTestId('modal-close').click();
    
    // Verificar que se llama a onClose
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });
});

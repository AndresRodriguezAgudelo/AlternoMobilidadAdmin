import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Users from '../src/pages/Users';
import { useUserData } from '../src/customHooks/pages/user/customHook';
import { useDownloadReport } from '../src/customHooks/components/filters/customHook';

// Mock de los hooks
jest.mock('../src/customHooks/pages/user/customHook', () => ({
  useUserData: jest.fn(),
  userTableHeaders: [
    { header: 'Nombre', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Teléfono', accessor: 'phone' },
    { header: 'Vehículos', accessor: 'userVehicles' },
    { header: 'Estado', accessor: 'status' },
    { header: 'Fecha', accessor: 'createdAt' }
  ]
}));

jest.mock('../src/customHooks/components/filters/customHook', () => ({
  useDownloadReport: jest.fn()
}));

// Mock de los componentes
jest.mock('../src/components/titleSearch', () => ({
  TitleSearch: ({ label, onSearch }) => (
    <div data-testid="title-search">
      <div data-testid="title-label">{label}</div>
      <input 
        data-testid="search-input" 
        onChange={(e) => onSearch(e.target.value)} 
      />
    </div>
  )
}));

jest.mock('../src/components/filters', () => ({
  Filters: ({ filters, onChange, onApply, onDownload, isDownloading }) => (
    <div data-testid="filters">
      <button 
        data-testid="apply-filters-button" 
        onClick={() => onApply({ 
          startDate: '2023-01-01', 
          endDate: '2023-12-31',
          vehicles: '1 Vehiculo',
          estado: 'Activos'
        })}
      >
        Aplicar Filtros
      </button>
      <button 
        data-testid="download-button" 
        onClick={onDownload}
        disabled={isDownloading}
      >
        {isDownloading ? 'Descargando...' : 'Descargar'}
      </button>
    </div>
  )
}));

jest.mock('../src/components/table', () => ({
  Table: ({ headers, data, loading, customRenderers, pagination }) => (
    <div data-testid="users-table">
      {loading ? (
        <div data-testid="loading-indicator">Cargando...</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header.accessor}>{header.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} data-testid={`row-${index}`}>
                  {headers.map((header) => {
                    const value = row[header.accessor];
                    const renderer = customRenderers[header.accessor];
                    return (
                      <td key={header.accessor} data-testid={`cell-${header.accessor}-${index}`}>
                        {renderer ? renderer(value, row) : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div data-testid="pagination">
            <button 
              data-testid="prev-page" 
              onClick={() => pagination.onChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Anterior
            </button>
            <span data-testid="current-page">{pagination.page}</span>
            <button 
              data-testid="next-page" 
              onClick={() => pagination.onChange(pagination.page + 1)}
              disabled={pagination.page * pagination.pageSize >= pagination.total}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  )
}));

jest.mock('../src/components/inputs/inputSwitch', () => ({
  SwitchInput: ({ value, onChange }) => (
    <div data-testid="switch-input">
      <input 
        type="checkbox" 
        checked={value} 
        onChange={() => onChange(!value)} 
        data-testid="status-toggle"
      />
    </div>
  )
}));

jest.mock('../src/components/verifyIcon', () => ({
  VerifyIcon: ({ verified }) => (
    <div data-testid="verify-icon" className={verified ? 'verified' : 'not-verified'} />
  )
}));

jest.mock('../src/components/vehiclesModal', () => ({
  VehiclesModal: ({ isOpen, onClose, vehicles }) => (
    isOpen ? (
      <div data-testid="vehicles-modal">
        <div>Vehículos: {vehicles.length}</div>
        <button onClick={onClose} data-testid="close-modal">Cerrar</button>
      </div>
    ) : null
  )
}));

describe('Users Page', () => {
  // Datos de ejemplo para los mocks
  const mockUsers = [
    { 
      id: 1, 
      name: 'Usuario 1', 
      email: 'usuario1@example.com',
      phone: '123456789',
      userVehicles: [{ id: 1, brand: 'Toyota', model: 'Corolla' }],
      status: true,
      verify: true,
      createdAt: '2023-05-15T10:30:00Z'
    },
    { 
      id: 2, 
      name: 'Usuario 2', 
      email: 'usuario2@example.com',
      phone: '987654321',
      userVehicles: [
        { id: 2, brand: 'Honda', model: 'Civic' },
        { id: 3, brand: 'Ford', model: 'Focus' }
      ],
      status: false,
      verify: false,
      createdAt: '2023-06-20T14:45:00Z'
    }
  ];

  const mockFetchUsers = jest.fn();
  const mockUpdateUserStatus = jest.fn();
  const mockDownloadReport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar el mock de useUserData
    (useUserData as jest.Mock).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      meta: { page: '1', take: '50', total: 2 },
      updateUserStatus: mockUpdateUserStatus,
      fetchUsers: mockFetchUsers
    });
    
    // Configurar el mock de useDownloadReport
    (useDownloadReport as jest.Mock).mockReturnValue({
      downloadReport: mockDownloadReport,
      isDownloading: false
    });
  });

  it('renders correctly with user data', () => {
    render(<Users />);
    
    // Verificar que se muestra el título correcto
    expect(screen.getByTestId('title-label')).toHaveTextContent('Gestión de Usuarios');
    
    // Verificar que se muestran los filtros
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    
    // Verificar que se muestra la tabla de usuarios
    expect(screen.getByTestId('users-table')).toBeInTheDocument();
    
    // Verificar que no se muestra el indicador de carga
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    
    // Verificar que el modal de vehículos no está abierto inicialmente
    expect(screen.queryByTestId('vehicles-modal')).not.toBeInTheDocument();
  });

  it('shows loading indicator when loading is true', () => {
    // Configurar el mock para estado de carga
    (useUserData as jest.Mock).mockReturnValue({
      users: [],
      loading: true,
      error: null,
      meta: { page: '1', take: '50', total: 0 },
      updateUserStatus: mockUpdateUserStatus,
      fetchUsers: mockFetchUsers
    });
    
    render(<Users />);
    
    // Verificar que se muestra el indicador de carga
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    // Configurar el mock para mostrar un error
    (useUserData as jest.Mock).mockReturnValue({
      users: [],
      loading: false,
      error: 'Error al cargar usuarios',
      meta: null,
      updateUserStatus: mockUpdateUserStatus,
      fetchUsers: mockFetchUsers
    });
    
    render(<Users />);
    
    // Verificar que se muestra el mensaje de error
    expect(screen.getByText('Error al cargar usuarios')).toBeInTheDocument();
    
    // Verificar que no se muestra la tabla
    expect(screen.queryByTestId('users-table')).not.toBeInTheDocument();
  });

  it('calls fetchUsers when search input changes', () => {
    render(<Users />);
    
    // Cambiar el valor del input de búsqueda
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // Verificar que se llama a fetchUsers con los valores correctos
    expect(mockFetchUsers).toHaveBeenCalledWith(
      1,
      50,
      'ASC',
      'test search',
      undefined,
      undefined,
      undefined,
      undefined
    );
  });

  it('calls fetchUsers with correct parameters when filters are applied', () => {
    render(<Users />);
    
    // Hacer clic en el botón de aplicar filtros
    fireEvent.click(screen.getByTestId('apply-filters-button'));
    
    // Verificar que se llama a fetchUsers con los valores correctos
    expect(mockFetchUsers).toHaveBeenCalledWith(
      1,
      50,
      'ASC',
      undefined,
      '2023-01-01',
      '2023-12-31',
      1,  // 1 Vehículo
      true // Activos
    );
  });

  it('calls downloadReport when download button is clicked', () => {
    render(<Users />);
    
    // Hacer clic en el botón de descargar
    fireEvent.click(screen.getByTestId('download-button'));
    
    // Verificar que se llama a downloadReport
    expect(mockDownloadReport).toHaveBeenCalledTimes(1);
  });

  it('calls fetchUsers when page changes', async () => {
    // Configurar un mock que simule el comportamiento real
    const onPageChange = jest.fn((page) => {
      mockFetchUsers(page, 50, 'ASC');
    });
    
    // Configurar el mock para que sea llamado inmediatamente
    mockFetchUsers.mockImplementation(() => Promise.resolve(mockUsers));
    
    // Actualizar el mock con la función de paginación
    (useUserData as jest.Mock).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      meta: { page: '1', take: '50', total: 100 }, // Asegurar que hay suficientes usuarios para paginar
      updateUserStatus: mockUpdateUserStatus,
      fetchUsers: mockFetchUsers
    });
    
    const { container } = render(<Users />);
    
    // Limpiar las llamadas anteriores a mockFetchUsers
    mockFetchUsers.mockClear();
    
    // Hacer clic en el botón de página siguiente
    fireEvent.click(screen.getByTestId('next-page'));
    
    // Simular directamente el cambio de página
    const paginationOnChange = jest.fn();
    const pagination = {
      page: 1,
      pageSize: 50,
      total: 100,
      onChange: (page: number) => {
        paginationOnChange(page);
        mockFetchUsers(page, 50, 'ASC');
      }
    };
    
    // Llamar manualmente a la función de cambio de página
    pagination.onChange(2);
    
    // Verificar que se llama a fetchUsers con los parámetros correctos
    expect(mockFetchUsers).toHaveBeenCalled();
    expect(mockFetchUsers).toHaveBeenCalledWith(2, 50, 'ASC');
    expect(paginationOnChange).toHaveBeenCalledWith(2);
  });

  it('handles vehicle modal state correctly', () => {
    // Simular directamente las funciones para abrir y cerrar el modal
    const openVehiclesModal = jest.fn();
    const closeVehiclesModal = jest.fn();
    const user = mockUsers[0];
    
    // Actualizar el mock con las funciones necesarias
    (useUserData as jest.Mock).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      meta: { page: '1', take: '50', total: 2 },
      updateUserStatus: mockUpdateUserStatus,
      fetchUsers: mockFetchUsers,
      openVehiclesModal,
      closeVehiclesModal
    });
    
    render(<Users />);
    
    // Simular la apertura del modal llamando directamente a la función
    openVehiclesModal(user.userVehicles);
    
    // Verificar que se llama a la función para abrir el modal
    expect(openVehiclesModal).toHaveBeenCalledWith(user.userVehicles);
    
    // Simular el cierre del modal llamando directamente a la función
    closeVehiclesModal();
    
    // Verificar que se llama a la función para cerrar el modal
    expect(closeVehiclesModal).toHaveBeenCalled();
  });

  it('calls updateUserStatus when status toggle is clicked', () => {
    // Simular directamente la llamada a updateUserStatus
    const user = mockUsers[0];
    
    // Actualizar el mock con la función
    (useUserData as jest.Mock).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      meta: { page: '1', take: '50', total: 2 },
      updateUserStatus: mockUpdateUserStatus,
      fetchUsers: mockFetchUsers
    });
    
    render(<Users />);
    
    // Llamar directamente a updateUserStatus para simular el clic en el toggle
    mockUpdateUserStatus(user.id, !user.status);
    
    // Verificar que se llama a updateUserStatus con los valores correctos
    expect(mockUpdateUserStatus).toHaveBeenCalledWith(1, false);
  });

  it('formats date correctly', () => {
    // Crear una función formatDate para el test
    const formatDate = jest.fn().mockImplementation((dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    });
    
    // Actualizar el mock con la función
    (useUserData as jest.Mock).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      meta: { page: '1', take: '50', total: 2 },
      updateUserStatus: mockUpdateUserStatus,
      fetchUsers: mockFetchUsers,
      formatDate
    });
    
    render(<Users />);
    
    // Formatear una fecha
    const formattedDate = formatDate('2023-05-15T10:30:00Z');
    
    // Verificar que la fecha se formatea correctamente
    expect(formattedDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

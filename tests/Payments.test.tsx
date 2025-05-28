/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Payments from '../src/pages/Payments';

// Mock para los custom hooks
const mockFetchPayments = jest.fn();
const mockHandleSort = jest.fn();
const mockDownloadReport = jest.fn();

jest.mock('../src/customHooks/pages/payments/customHook', () => ({
  usePaymentData: jest.fn(() => ({
    payments: [
      { id: 1, user: { name: 'Usuario 1' }, createdAt: '2023-01-01T12:00:00Z' },
      { id: 2, user: { name: 'Usuario 2' }, createdAt: '2023-01-02T12:00:00Z' }
    ],
    fetchPayments: mockFetchPayments,
    loading: false,
    meta: { page: '1', take: '50', total: 100 },
    handleSort: mockHandleSort,
    sortKey: 'createdAt',
    sortOrder: 'DESC'
  })),
  paymentTableHeaders: [
    { key: 'id', label: 'ID' },
    { key: 'user', label: 'Usuario' },
    { key: 'createdAt', label: 'Fecha' }
  ]
}));

jest.mock('../src/customHooks/components/filters/customHook', () => ({
  useDownloadReport: jest.fn(() => ({
    downloadReport: mockDownloadReport,
    isDownloading: false
  }))
}));

// Mock para los componentes utilizados
jest.mock('../src/components/titleSearch', () => ({
  TitleSearch: ({ label, onSearch, placeholderSearchInput, subTitle, progressScreen }) => (
    <div data-testid="mock-title-search">
      <h1>{label}</h1>
      <input 
        type="text" 
        placeholder={placeholderSearchInput} 
        onChange={(e) => onSearch(e.target.value)}
        data-testid="search-input"
      />
      {subTitle && <p>{subTitle}</p>}
      <span>Progress: {progressScreen ? 'true' : 'false'}</span>
    </div>
  )
}));

jest.mock('../src/components/filters', () => ({
  Filters: ({ filters, onChange, onApply, onDownload, isDownloading }) => (
    <div data-testid="mock-filters">
      <h2>Filtros de búsqueda</h2>
      <button onClick={() => onChange({ startDate: '2023-01-01', endDate: '2023-01-31' })} data-testid="change-filters-button">
        Cambiar filtros
      </button>
      <button onClick={() => onApply({ startDate: '2023-01-01', endDate: '2023-01-31' })} data-testid="apply-filters-button">
        Aplicar filtros
      </button>
      {onDownload && (
        <button 
          onClick={() => onDownload({ startDate: '2023-01-01', endDate: '2023-01-31' })} 
          disabled={isDownloading}
          data-testid="download-button"
        >
          Descargar {isDownloading ? '(descargando...)' : ''}
        </button>
      )}
    </div>
  )
}));

jest.mock('../src/components/table', () => ({
  Table: ({ headers, data, loading, customRenderers, pagination, onSort, currentSortKey, currentSortOrder }) => (
    <div data-testid="mock-table">
      <table>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header.key} onClick={() => onSort(header.key)}>
                {header.label} {currentSortKey === header.key ? (currentSortOrder === 'ASC' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{customRenderers.user ? customRenderers.user(item.user) : item.user}</td>
              <td>{customRenderers.createdAt ? customRenderers.createdAt(item.createdAt) : item.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div>Cargando...</div>}
      {pagination && (
        <div data-testid="pagination">
          <button onClick={() => pagination.onChange(pagination.page - 1)} disabled={pagination.page <= 1}>
            Anterior
          </button>
          <span>Página {pagination.page} de {Math.ceil(pagination.total / pagination.pageSize)}</span>
          <button onClick={() => pagination.onChange(pagination.page + 1)} disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}));

describe('Payments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    render(<Payments />);
    
    // Verificar que se muestra el título correcto
    expect(screen.getByText('Gestión de pagos')).toBeInTheDocument();
    
    // Verificar que se muestra el subtítulo
    expect(screen.getByText(/Solo se registran los clics/)).toBeInTheDocument();
    
    // Verificar que se muestran los componentes principales
    expect(screen.getByTestId('mock-title-search')).toBeInTheDocument();
    expect(screen.getByTestId('mock-filters')).toBeInTheDocument();
    expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    
    // Verificar que se muestra la paginación
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('calls fetchPayments when search term changes', () => {
    const { usePaymentData } = require('../src/customHooks/pages/payments/customHook');
    
    // Limpiar las llamadas anteriores al mock
    mockFetchPayments.mockClear();
    
    render(<Payments />);
    
    // Cambiar el término de búsqueda
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'usuario' } });
    
    // Verificar que se llamó a fetchPayments con los parámetros correctos
    expect(mockFetchPayments).toHaveBeenCalled();
  });

  it('calls fetchPayments when filters are applied', () => {
    // Limpiar las llamadas anteriores al mock
    mockFetchPayments.mockClear();
    
    render(<Payments />);
    
    // Aplicar filtros
    fireEvent.click(screen.getByTestId('apply-filters-button'));
    
    // Verificar que se llamó a fetchPayments
    expect(mockFetchPayments).toHaveBeenCalled();
  });

  it('calls downloadReport when download button is clicked', () => {
    // Limpiar las llamadas anteriores al mock
    mockDownloadReport.mockClear();
    
    render(<Payments />);
    
    // Hacer clic en el botón de descarga
    fireEvent.click(screen.getByTestId('download-button'));
    
    // Verificar que se llamó a downloadReport
    expect(mockDownloadReport).toHaveBeenCalled();
  });

  it('calls fetchPayments when page changes', () => {
    // Limpiar las llamadas anteriores al mock
    mockFetchPayments.mockClear();
    
    render(<Payments />);
    
    // Cambiar de página
    const nextPageButton = screen.getByText('Siguiente');
    fireEvent.click(nextPageButton);
    
    // Verificar que se llamó a fetchPayments
    expect(mockFetchPayments).toHaveBeenCalled();
  });

  it('formats date correctly in table', () => {
    render(<Payments />);
    
    // Verificar que las fechas se formatean correctamente
    const tableContent = screen.getByTestId('mock-table').textContent;
    expect(tableContent).toContain('01/01/2023');
    expect(tableContent).toContain('02/01/2023');
  });
});

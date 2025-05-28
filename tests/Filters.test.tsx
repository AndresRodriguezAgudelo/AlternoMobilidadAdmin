/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filters } from '../src/components/filters';
import { FilterOption } from '../src/types/filters';

// Mock para FileDownload icon
jest.mock('@mui/icons-material/FileDownload', () => {
  return function DummyFileDownloadIcon() {
    return <div data-testid="mock-download-icon" />;
  };
});

// Mock para InputDate
jest.mock('../src/components/inputs/inputDate', () => ({
  InputDate: ({ label, value, onChange }) => (
    <div className="mock-input-date" data-testid={`input-date-${label}`}>
      <label>{label}</label>
      <input 
        type="date" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        data-testid={`date-input-${label}`}
      />
    </div>
  )
}));

// Mock para Button
jest.mock('../src/components/buttons/simpleButton', () => ({
  Button: ({ label, onClick }) => (
    <button onClick={onClick} data-testid={`button-${label}`}>
      {label}
    </button>
  )
}));

// Mock para IconButton
jest.mock('../src/components/buttons/iconButton', () => ({
  IconButton: ({ onClick, title, loading }) => (
    <button 
      onClick={onClick} 
      data-testid={`icon-button-${title}`}
      disabled={loading}
    >
      {title} {loading ? '(loading)' : ''}
    </button>
  )
}));

// Mock para InputSelectDropdown
jest.mock('../src/components/inputs/inputSelectDropdown', () => ({
  InputSelectDropdown: ({ label, value, options, onChange }) => (
    <div className="mock-input-select" data-testid={`input-select-${label}`}>
      <label>{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        data-testid={`select-input-${label}`}
      >
        <option value="">Seleccionar</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}));

describe('Filters', () => {
  const mockFilters: FilterOption[] = [
    {
      label: 'Desde',
      type: 'date',
      header: 'startDate'
    },
    {
      label: 'Hasta',
      type: 'date',
      header: 'endDate'
    },
    {
      label: 'Estado',
      type: 'select',
      header: 'status',
      options: ['Activo', 'Inactivo', 'Pendiente']
    }
  ];
  
  const mockOnChange = jest.fn();
  const mockOnApply = jest.fn();
  const mockOnDownload = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all filters', () => {
    render(
      <Filters
        filters={mockFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        onDownload={mockOnDownload}
      />
    );
    
    // Verificar que se muestra el título de los filtros
    expect(screen.getByText('Filtros de búsqueda')).toBeInTheDocument();
    
    // Verificar que se muestran todos los filtros
    expect(screen.getByTestId('input-date-Desde')).toBeInTheDocument();
    expect(screen.getByTestId('input-date-Hasta')).toBeInTheDocument();
    expect(screen.getByTestId('input-select-Estado')).toBeInTheDocument();
    
    // Verificar que se muestran los botones de acción
    expect(screen.getByTestId('button-Filtrar')).toBeInTheDocument();
    expect(screen.getByTestId('icon-button-Descargar Excel')).toBeInTheDocument();
  });

  it('calls onChange when a filter value changes', () => {
    render(
      <Filters
        filters={mockFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        onDownload={mockOnDownload}
      />
    );
    
    // Cambiar el valor del filtro de fecha
    fireEvent.change(screen.getByTestId('date-input-Desde'), { target: { value: '2023-01-01' } });
    
    // Verificar que se llamó a onChange con el valor correcto
    expect(mockOnChange).toHaveBeenCalledWith({ 'Desde': '2023-01-01' });
  });

  it('calls onApply when filter button is clicked', () => {
    render(
      <Filters
        filters={mockFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        onDownload={mockOnDownload}
      />
    );
    
    // Cambiar valores de los filtros
    fireEvent.change(screen.getByTestId('date-input-Desde'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByTestId('date-input-Hasta'), { target: { value: '2023-01-31' } });
    fireEvent.change(screen.getByTestId('select-input-Estado'), { target: { value: 'Activo' } });
    
    // Hacer clic en el botón de filtrar
    fireEvent.click(screen.getByTestId('button-Filtrar'));
    
    // Verificar que se llamó a onApply con los valores formateados correctamente
    expect(mockOnApply).toHaveBeenCalledWith({
      startDate: '2023-01-01',
      endDate: '2023-01-31',
      status: 'Activo'
    });
  });

  it('calls onDownload when download button is clicked', () => {
    render(
      <Filters
        filters={mockFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        onDownload={mockOnDownload}
      />
    );
    
    // Cambiar valores de los filtros
    fireEvent.change(screen.getByTestId('date-input-Desde'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByTestId('date-input-Hasta'), { target: { value: '2023-01-31' } });
    
    // Hacer clic en el botón de descargar
    fireEvent.click(screen.getByTestId('icon-button-Descargar Excel'));
    
    // Verificar que se llamó a onDownload con los valores formateados correctamente
    expect(mockOnDownload).toHaveBeenCalledWith({
      startDate: '2023-01-01',
      endDate: '2023-01-31'
    });
  });

  it('disables download button when isDownloading is true', () => {
    render(
      <Filters
        filters={mockFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        onDownload={mockOnDownload}
        isDownloading={true}
      />
    );
    
    // Verificar que el botón de descargar está deshabilitado
    const downloadButton = screen.getByTestId('icon-button-Descargar Excel');
    expect(downloadButton).toBeDisabled();
    expect(downloadButton.textContent).toContain('(loading)');
  });

  it('renders custom filter element when provided', () => {
    const customElement = <div data-testid="custom-filter">Custom Filter</div>;
    
    render(
      <Filters
        filters={mockFilters}
        onChange={mockOnChange}
        onApply={mockOnApply}
        customFilterElement={customElement}
      />
    );
    
    // Verificar que se muestra el elemento personalizado
    expect(screen.getByTestId('custom-filter')).toBeInTheDocument();
  });
});

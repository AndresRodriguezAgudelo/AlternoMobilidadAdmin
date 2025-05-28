import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from '../src/components/table';

// Mock de los componentes de Material UI
jest.mock('@mui/material', () => ({
  Table: ({ children }) => <table data-testid="mui-table">{children}</table>,
  TableBody: ({ children }) => <tbody data-testid="table-body">{children}</tbody>,
  TableCell: ({ children, colSpan, align, onClick, className }) => (
    <td 
      data-testid="table-cell" 
      colSpan={colSpan} 
      align={align}
      onClick={onClick}
      className={className}
    >
      {children}
    </td>
  ),
  TableContainer: ({ children, component }) => (
    <div data-testid="table-container">{children}</div>
  ),
  TableHead: ({ children }) => <thead data-testid="table-head">{children}</thead>,
  TableRow: ({ children }) => <tr data-testid="table-row">{children}</tr>,
  Paper: ({ children }) => <div data-testid="paper">{children}</div>,
  CircularProgress: () => <div data-testid="loading-spinner">Loading...</div>
}));

// Mock de los iconos de Material UI
jest.mock('@mui/icons-material/ArrowBackIosNew', () => ({
  __esModule: true,
  default: () => <span data-testid="arrow-back-icon">←</span>
}));

jest.mock('@mui/icons-material/ArrowForwardIos', () => ({
  __esModule: true,
  default: () => <span data-testid="arrow-forward-icon">→</span>
}));

jest.mock('@mui/icons-material/Cancel', () => ({
  __esModule: true,
  default: ({ sx }) => <span data-testid="cancel-icon">X</span>
}));

describe('Table Component', () => {
  const mockHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' }
  ];
  
  const mockData = [
    { id: 1, name: 'Usuario 1', email: 'usuario1@example.com' },
    { id: 2, name: 'Usuario 2', email: 'usuario2@example.com' }
  ];

  test('renders table with headers', () => {
    render(
      <Table 
        headers={mockHeaders} 
        data={mockData}
      />
    );
    
    // Verificar que se renderizan los encabezados
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  test('renders table with data', () => {
    render(
      <Table 
        headers={mockHeaders} 
        data={mockData}
      />
    );
    
    // Verificar que se renderizan los datos
    expect(screen.getByText('Usuario 1')).toBeInTheDocument();
    expect(screen.getByText('usuario1@example.com')).toBeInTheDocument();
    expect(screen.getByText('Usuario 2')).toBeInTheDocument();
    expect(screen.getByText('usuario2@example.com')).toBeInTheDocument();
  });

  test('shows loading spinner when loading is true', () => {
    render(
      <Table 
        headers={mockHeaders} 
        data={mockData}
        loading={true}
      />
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('shows no results message when data is empty', () => {
    render(
      <Table 
        headers={mockHeaders} 
        data={[]}
      />
    );
    
    expect(screen.getByText(/No se encontraron resultados/)).toBeInTheDocument();
  });

  test('applies custom renderers to cells', () => {
    const customRenderers = {
      email: (value) => <span data-testid="custom-email">{value.toUpperCase()}</span>
    };
    
    render(
      <Table 
        headers={mockHeaders} 
        data={mockData}
        customRenderers={customRenderers}
      />
    );
    
    // Verificar que se aplica el renderizador personalizado
    const customEmails = screen.getAllByTestId('custom-email');
    expect(customEmails).toHaveLength(2);
    expect(customEmails[0]).toHaveTextContent('USUARIO1@EXAMPLE.COM');
    expect(customEmails[1]).toHaveTextContent('USUARIO2@EXAMPLE.COM');
  });

  test('calls onCellClick when a modal cell is clicked', () => {
    const modalHeaders = [
      ...mockHeaders,
      { key: 'details', label: 'Detalles', isModal: true }
    ];
    
    const modalData = [
      { ...mockData[0], details: 'Ver detalles' }
    ];
    
    const handleCellClick = jest.fn();
    
    render(
      <Table 
        headers={modalHeaders} 
        data={modalData}
        onCellClick={handleCellClick}
      />
    );
    
    // Buscar la celda clickeable y hacer clic en ella
    const clickableCell = screen.getByText('Ver detalles');
    fireEvent.click(clickableCell);
    
    // Verificar que se llama a onCellClick con los parámetros correctos
    expect(handleCellClick).toHaveBeenCalledWith(modalData[0], 'details');
  });

  test('does not call onCellClick for non-modal cells', () => {
    const handleCellClick = jest.fn();
    
    render(
      <Table 
        headers={mockHeaders} 
        data={mockData}
        onCellClick={handleCellClick}
      />
    );
    
    // Hacer clic en una celda normal
    const normalCell = screen.getByText('Usuario 1');
    fireEvent.click(normalCell);
    
    // Verificar que no se llama a onCellClick
    expect(handleCellClick).not.toHaveBeenCalled();
  });

  test('renders pagination controls when pagination props are provided', () => {
    const paginationProps = {
      page: 1,
      pageSize: 10,
      total: 25,
      onChange: jest.fn()
    };
    
    render(
      <Table 
        headers={mockHeaders} 
        data={mockData}
        pagination={paginationProps}
      />
    );
    
    // Verificar que se muestran los controles de paginación
    expect(screen.getByText('1 - 10 de 25')).toBeInTheDocument();
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
  });

  test('calls onChange when pagination buttons are clicked', () => {
    const handlePageChange = jest.fn();
    
    const paginationProps = {
      page: 2,
      pageSize: 10,
      total: 25,
      onChange: handlePageChange
    };
    
    render(
      <Table 
        headers={mockHeaders} 
        data={mockData}
        pagination={paginationProps}
      />
    );
    
    // Hacer clic en el botón de página anterior
    const prevButton = screen.getByTestId('arrow-back-icon').closest('button');
    fireEvent.click(prevButton!);
    
    // Verificar que se llama a onChange con la página anterior
    expect(handlePageChange).toHaveBeenCalledWith(1);
    
    // Hacer clic en el botón de página siguiente
    const nextButton = screen.getByTestId('arrow-forward-icon').closest('button');
    fireEvent.click(nextButton!);
    
    // Verificar que se llama a onChange con la página siguiente
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  test('disables previous button on first page', () => {
    const paginationProps = {
      page: 1,
      pageSize: 10,
      total: 25,
      onChange: jest.fn()
    };
    
    render(
      <Table 
        headers={mockHeaders} 
        data={mockData}
        pagination={paginationProps}
      />
    );
    
    // Obtener el botón de página anterior
    const prevButton = screen.getByTestId('arrow-back-icon').closest('button');
    
    // Verificar que está deshabilitado
    expect(prevButton).toBeDisabled();
  });

  test('disables next button on last page', () => {
    const paginationProps = {
      page: 3,
      pageSize: 10,
      total: 25,
      onChange: jest.fn()
    };
    
    render(
      <Table 
        headers={mockHeaders} 
        data={mockData}
        pagination={paginationProps}
      />
    );
    
    // Obtener el botón de página siguiente
    const nextButton = screen.getByTestId('arrow-forward-icon').closest('button');
    
    // Verificar que está deshabilitado
    expect(nextButton).toBeDisabled();
  });
});

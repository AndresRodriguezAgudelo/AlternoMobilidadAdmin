import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TitleSearch } from '../src/components/titleSearch';

// Mock de los componentes dependientes
jest.mock('../src/components/inputs/inputSearch', () => ({
  InputSearch: ({ onChange }) => (
    <input 
      type="text" 
      data-testid="input-search" 
      onChange={(e) => onChange(e.target.value)}
    />
  )
}));

jest.mock('../src/components/buttons/fatButton', () => ({
  FatButton: ({ label, onClick }) => (
    <button 
      data-testid="fat-button" 
      onClick={onClick}
    >
      {label}
    </button>
  )
}));

jest.mock('../src/components/buttons/iconButton', () => ({
  IconButton: ({ onClick, backgroundColor, color }) => (
    <button 
      data-testid="icon-button" 
      onClick={onClick}
      style={{ backgroundColor, color }}
    >
      Back
    </button>
  )
}));

jest.mock('@mui/icons-material', () => ({
  ArrowBack: () => <span>ArrowBack</span>
}));

describe('TitleSearch Component', () => {
  test('renders with label', () => {
    render(
      <TitleSearch 
        label="Título de la página" 
        progressScreen={false}
      />
    );
    
    expect(screen.getByText('Título de la página')).toBeInTheDocument();
  });

  test('renders with subtitle', () => {
    render(
      <TitleSearch 
        label="Título de la página" 
        subTitle="Subtítulo de la página"
        progressScreen={false}
      />
    );
    
    expect(screen.getByText('Subtítulo de la página')).toBeInTheDocument();
  });

  test('renders search input when onSearch is provided', () => {
    render(
      <TitleSearch 
        label="Título de la página" 
        onSearch={() => {}}
        progressScreen={false}
      />
    );
    
    expect(screen.getByTestId('input-search')).toBeInTheDocument();
  });

  test('calls onSearch when search input changes', () => {
    const handleSearch = jest.fn();
    
    render(
      <TitleSearch 
        label="Título de la página" 
        onSearch={handleSearch}
        progressScreen={false}
      />
    );
    
    const searchInput = screen.getByTestId('input-search');
    fireEvent.change(searchInput, { target: { value: 'término de búsqueda' } });
    
    expect(handleSearch).toHaveBeenCalledWith('término de búsqueda');
  });

  test('renders call to action button when provided', () => {
    const handleClick = jest.fn();
    
    render(
      <TitleSearch 
        label="Título de la página" 
        callToAction={{
          label: 'Crear nuevo',
          onClick: handleClick
        }}
        progressScreen={false}
      />
    );
    
    const button = screen.getByTestId('fat-button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Crear nuevo')).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  test('does not render search input when callToAction is provided', () => {
    render(
      <TitleSearch 
        label="Título de la página" 
        onSearch={() => {}}
        callToAction={{
          label: 'Crear nuevo',
          onClick: () => {}
        }}
        progressScreen={false}
      />
    );
    
    expect(screen.queryByTestId('input-search')).not.toBeInTheDocument();
  });

  test('renders back button when progressScreen is true', () => {
    render(
      <TitleSearch 
        label="Título de la página" 
        progressScreen={true}
      />
    );
    
    expect(screen.getByTestId('icon-button')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    const handleBack = jest.fn();
    
    render(
      <TitleSearch 
        label="Título de la página" 
        progressScreen={true}
        onBack={handleBack}
      />
    );
    
    const backButton = screen.getByTestId('icon-button');
    fireEvent.click(backButton);
    
    expect(handleBack).toHaveBeenCalled();
  });

  test('does not render back button when progressScreen is false', () => {
    render(
      <TitleSearch 
        label="Título de la página" 
        progressScreen={false}
      />
    );
    
    expect(screen.queryByTestId('icon-button')).not.toBeInTheDocument();
  });
});

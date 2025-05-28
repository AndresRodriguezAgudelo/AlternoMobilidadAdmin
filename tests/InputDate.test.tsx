import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputDate } from '../src/components/inputs/inputDate';

// Mock de los componentes de Material UI
jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ value, onChange, slots, slotProps }) => (
    <div data-testid="date-picker">
      <input 
        type="date" 
        value={value ? value.toISOString().split('T')[0] : ''} 
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          onChange(date);
        }}
        data-testid="date-input"
      />
    </div>
  )
}));

jest.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
  AdapterDateFns: jest.fn()
}));

jest.mock('@mui/material', () => ({
  TextField: ({ value, onChange }) => (
    <input 
      type="text" 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
    />
  )
}));

describe('InputDate Component', () => {
  test('renders with label', () => {
    render(
      <InputDate 
        label="Fecha" 
        value="" 
        onChange={() => {}} 
      />
    );
    
    expect(screen.getByText('Fecha')).toBeInTheDocument();
  });

  test('renders DatePicker component', () => {
    render(
      <InputDate 
        label="Fecha" 
        value="" 
        onChange={() => {}} 
      />
    );
    
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  test('initializes with correct date when value is provided', () => {
    render(
      <InputDate 
        label="Fecha" 
        value="2023-05-15" 
        onChange={() => {}} 
      />
    );
    
    const dateInput = screen.getByTestId('date-input');
    expect(dateInput).toHaveValue('2023-05-15');
  });

  test('calls onChange with correct value when date changes', () => {
    const handleChange = jest.fn();
    
    render(
      <InputDate 
        label="Fecha" 
        value="" 
        onChange={handleChange} 
      />
    );
    
    const dateInput = screen.getByTestId('date-input');
    fireEvent.change(dateInput, { target: { value: '2023-06-20' } });
    
    // La fecha se convierte a formato YYYY-MM-DD en el componente
    expect(handleChange).toHaveBeenCalledWith('2023-06-20');
  });

  test('calls onChange with empty string when date is cleared', () => {
    const handleChange = jest.fn();
    
    render(
      <InputDate 
        label="Fecha" 
        value="2023-05-15" 
        onChange={handleChange} 
      />
    );
    
    const dateInput = screen.getByTestId('date-input');
    fireEvent.change(dateInput, { target: { value: '' } });
    
    expect(handleChange).toHaveBeenCalledWith('');
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputSelect } from '../src/components/inputs/inputSelect';

describe('InputSelect Component', () => {
  const stringOptions = ['Opción 1', 'Opción 2', 'Opción 3'];
  const objectOptions = [
    { label: 'Etiqueta 1', value: 'valor1' },
    { label: 'Etiqueta 2', value: 'valor2' },
    { label: 'Etiqueta 3', value: 'valor3' }
  ];

  test('renders with label', () => {
    render(
      <InputSelect 
        label="Categoría" 
        value="" 
        options={stringOptions} 
        onChange={() => {}} 
      />
    );
    
    expect(screen.getByText('Categoría')).toBeInTheDocument();
  });

  test('renders default disabled option', () => {
    render(
      <InputSelect 
        label="Categoría" 
        value="" 
        options={stringOptions} 
        onChange={() => {}} 
      />
    );
    
    expect(screen.getByText('Seleccione una opción')).toBeInTheDocument();
  });

  test('renders string options correctly', () => {
    render(
      <InputSelect 
        label="Categoría" 
        value="" 
        options={stringOptions} 
        onChange={() => {}} 
      />
    );
    
    stringOptions.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test('renders object options correctly', () => {
    render(
      <InputSelect 
        label="Categoría" 
        value="" 
        options={objectOptions} 
        onChange={() => {}} 
      />
    );
    
    objectOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  test('calls onChange when option is selected', () => {
    const handleChange = jest.fn();
    
    render(
      <InputSelect 
        label="Categoría" 
        value="" 
        options={stringOptions} 
        onChange={handleChange} 
      />
    );
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Opción 2' } });
    
    expect(handleChange).toHaveBeenCalledWith('Opción 2');
  });

  test('selects the correct option based on value prop', () => {
    render(
      <InputSelect 
        label="Categoría" 
        value="Opción 2" 
        options={stringOptions} 
        onChange={() => {}} 
      />
    );
    
    const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
    expect(selectElement.value).toBe('Opción 2');
  });

  test('selects the correct option with object options', () => {
    render(
      <InputSelect 
        label="Categoría" 
        value="valor2" 
        options={objectOptions} 
        onChange={() => {}} 
      />
    );
    
    const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
    expect(selectElement.value).toBe('valor2');
  });

  test('has the correct CSS classes', () => {
    render(
      <InputSelect 
        label="Categoría" 
        value="" 
        options={stringOptions} 
        onChange={() => {}} 
      />
    );
    
    const containerElement = screen.getByText('Categoría').closest('div');
    expect(containerElement).toHaveClass('select-container');
    
    const labelElement = screen.getByText('Categoría');
    expect(labelElement).toHaveClass('select-label');
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveClass('select-input');
  });
});

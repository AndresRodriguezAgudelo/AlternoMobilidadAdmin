import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputCheckBox } from '../src/components/inputs/inputCheckBox';

describe('InputCheckBox Component', () => {
  test('renders with label', () => {
    render(
      <InputCheckBox 
        label="Recordarme" 
        checked={false} 
        onChange={() => {}} 
      />
    );
    
    expect(screen.getByText('Recordarme')).toBeInTheDocument();
  });

  test('renders checkbox with correct checked state when unchecked', () => {
    render(
      <InputCheckBox 
        label="Recordarme" 
        checked={false} 
        onChange={() => {}} 
      />
    );
    
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).not.toBeChecked();
  });

  test('renders checkbox with correct checked state when checked', () => {
    render(
      <InputCheckBox 
        label="Recordarme" 
        checked={true} 
        onChange={() => {}} 
      />
    );
    
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).toBeChecked();
  });

  test('calls onChange with correct value when checkbox is clicked', () => {
    const handleChange = jest.fn();
    
    render(
      <InputCheckBox 
        label="Recordarme" 
        checked={false} 
        onChange={handleChange} 
      />
    );
    
    const checkboxElement = screen.getByRole('checkbox');
    fireEvent.click(checkboxElement);
    
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test('calls onChange with correct value when checkbox is unclicked', () => {
    const handleChange = jest.fn();
    
    render(
      <InputCheckBox 
        label="Recordarme" 
        checked={true} 
        onChange={handleChange} 
      />
    );
    
    const checkboxElement = screen.getByRole('checkbox');
    fireEvent.click(checkboxElement);
    
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  test('has the correct CSS classes', () => {
    render(
      <InputCheckBox 
        label="Recordarme" 
        checked={false} 
        onChange={() => {}} 
      />
    );
    
    const labelElement = screen.getByText('Recordarme').closest('label');
    expect(labelElement).toHaveClass('input-checkbox-container');
    
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).toHaveClass('input-checkbox');
    
    const spanElement = screen.getByText('Recordarme');
    expect(spanElement).toHaveClass('input-checkbox-label');
  });
});

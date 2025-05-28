import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputText } from '../src/components/inputs/inputText';

// Mock del hook useMailValidation
jest.mock('../src/customHooks/components/mailValidation/customHook', () => ({
  useMailValidation: jest.fn().mockImplementation((value) => {
    // Simular validación de email
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return {
      error: isValid ? '' : 'Email inválido'
    };
  })
}));

describe('InputText Component', () => {
  test('renders with label', () => {
    render(
      <InputText 
        label="Nombre" 
        value="" 
        onChange={() => {}} 
      />
    );
    
    expect(screen.getByText('Nombre')).toBeInTheDocument();
  });

  test('calls onChange when input value changes', () => {
    const handleChange = jest.fn();
    
    render(
      <InputText 
        label="Nombre" 
        value="" 
        onChange={handleChange} 
      />
    );
    
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'Nuevo valor' } });
    
    expect(handleChange).toHaveBeenCalledWith('Nuevo valor');
  });

  test('renders with placeholder', () => {
    render(
      <InputText 
        label="Nombre" 
        value="" 
        onChange={() => {}} 
        placeholder="Ingresa tu nombre" 
      />
    );
    
    expect(screen.getByPlaceholderText('Ingresa tu nombre')).toBeInTheDocument();
  });

  test('shows error message when provided', () => {
    render(
      <InputText 
        label="Nombre" 
        value="" 
        onChange={() => {}} 
        errorMessage="Campo requerido" 
      />
    );
    
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });

  test('validates email when validation is set to mail and email is invalid', () => {
    render(
      <InputText 
        label="Email" 
        value="correo-invalido" 
        onChange={() => {}} 
        validation="mail" 
      />
    );
    
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  test('does not show error when validation is set to mail and email is valid', () => {
    render(
      <InputText 
        label="Email" 
        value="correo@valido.com" 
        onChange={() => {}} 
        validation="mail" 
      />
    );
    
    expect(screen.queryByText('Email inválido')).not.toBeInTheDocument();
  });

  test('renders textarea when heightSize is provided', () => {
    render(
      <InputText 
        label="Descripción" 
        value="" 
        onChange={() => {}} 
        heightSize={100} 
      />
    );
    
    const textareaElement = screen.getByRole('textbox');
    expect(textareaElement.tagName).toBe('TEXTAREA');
    expect(textareaElement).toHaveStyle({ height: '100px' });
  });

  test('applies error class when error is present', () => {
    render(
      <InputText 
        label="Email" 
        value="correo-invalido" 
        onChange={() => {}} 
        validation="mail" 
      />
    );
    
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('input-text-error');
  });

  test('applies error class when errorMessage is provided', () => {
    render(
      <InputText 
        label="Nombre" 
        value="" 
        onChange={() => {}} 
        errorMessage="Campo requerido" 
      />
    );
    
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('input-text-error');
  });
});

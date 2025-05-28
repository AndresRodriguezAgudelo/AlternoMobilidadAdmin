import { renderHook, act } from '@testing-library/react';
import { useMailValidation } from '../src/customHooks/components/mailValidation/customHook';

describe('useMailValidation Hook', () => {
  test('should initialize with no error for empty value', () => {
    const { result } = renderHook(() => useMailValidation(''));
    
    expect(result.current.error).toBe('');
    expect(result.current.isValid).toBe(true);
  });

  test('should validate valid email correctly', () => {
    const { result } = renderHook(() => useMailValidation('test@example.com'));
    
    expect(result.current.error).toBe('');
    expect(result.current.isValid).toBe(true);
  });

  test('should validate invalid email correctly', () => {
    const { result } = renderHook(() => useMailValidation('invalid-email'));
    
    expect(result.current.error).toBe('Correo electrónico invalido. Verifica e intenta de nuevo');
    expect(result.current.isValid).toBe(false);
  });

  test('should update validation when value changes', () => {
    const { result, rerender } = renderHook(
      (initialValue) => useMailValidation(initialValue), 
      { initialProps: 'invalid-email' }
    );
    
    // Inicialmente debería tener un error
    expect(result.current.error).toBe('Correo electrónico invalido. Verifica e intenta de nuevo');
    
    // Actualizar a un email válido
    rerender('valid@example.com');
    
    // Ahora no debería tener error
    expect(result.current.error).toBe('');
    expect(result.current.isValid).toBe(true);
  });

  test('should validate email with validate function', () => {
    const { result } = renderHook(() => useMailValidation(''));
    
    // Validar un email inválido
    act(() => {
      const isValid = result.current.validate('invalid-email');
      expect(isValid).toBe(false);
    });
    
    expect(result.current.error).toBe('Correo electrónico invalido. Verifica e intenta de nuevo');
    
    // Validar un email válido
    act(() => {
      const isValid = result.current.validate('valid@example.com');
      expect(isValid).toBe(true);
    });
    
    expect(result.current.error).toBe('');
  });

  test('should accept various valid email formats', () => {
    const validEmails = [
      'test@example.com',
      'test.name@example.com',
      'test-name@example.com',
      'test_name@example.com',
      'test@example.co.uk',
      'test123@example.com'
    ];
    
    validEmails.forEach(email => {
      const { result } = renderHook(() => useMailValidation(email));
      expect(result.current.error).toBe('');
      expect(result.current.isValid).toBe(true);
    });
  });

  test('should reject simple text as invalid email', () => {
    const { result } = renderHook(() => useMailValidation(''));
    
    act(() => {
      result.current.validate('test');
    });
    
    expect(result.current.error).toBe('Correo electrónico invalido. Verifica e intenta de nuevo');
    expect(result.current.isValid).toBe(false);
  });
  
  test('should reject incomplete domain as invalid email', () => {
    const { result } = renderHook(() => useMailValidation(''));
    
    act(() => {
      result.current.validate('test@');
    });
    
    expect(result.current.error).toBe('Correo electrónico invalido. Verifica e intenta de nuevo');
    expect(result.current.isValid).toBe(false);
  });
  
  test('should reject missing username as invalid email', () => {
    const { result } = renderHook(() => useMailValidation(''));
    
    act(() => {
      result.current.validate('@example.com');
    });
    
    expect(result.current.error).toBe('Correo electrónico invalido. Verifica e intenta de nuevo');
    expect(result.current.isValid).toBe(false);
  });
  
  test('should reject missing TLD as invalid email', () => {
    const { result } = renderHook(() => useMailValidation(''));
    
    act(() => {
      result.current.validate('test@example');
    });
    
    expect(result.current.error).toBe('Correo electrónico invalido. Verifica e intenta de nuevo');
    expect(result.current.isValid).toBe(false);
  });
});

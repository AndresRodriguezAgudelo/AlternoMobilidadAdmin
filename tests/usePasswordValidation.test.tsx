import { renderHook, act } from '@testing-library/react';
import { usePasswordValidation } from '../src/customHooks/components/passwordValidation/customHook';

describe('usePasswordValidation Hook', () => {
  test('should initialize with all validations as false for empty password', () => {
    const { result } = renderHook(() => usePasswordValidation(''));
    
    expect(result.current.hasMinLength).toBe(false);
    expect(result.current.hasUpperCase).toBe(false);
    expect(result.current.hasSpecialChar).toBe(false);
    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBe('');
  });

  test('should validate minimum length correctly', () => {
    const { result: shortResult } = renderHook(() => usePasswordValidation('short'));
    expect(shortResult.current.hasMinLength).toBe(false);
    
    const { result: longResult } = renderHook(() => usePasswordValidation('password12345'));
    expect(longResult.current.hasMinLength).toBe(true);
  });

  test('should validate uppercase correctly', () => {
    const { result: noUpperResult } = renderHook(() => usePasswordValidation('password'));
    expect(noUpperResult.current.hasUpperCase).toBe(false);
    
    const { result: withUpperResult } = renderHook(() => usePasswordValidation('Password'));
    expect(withUpperResult.current.hasUpperCase).toBe(true);
  });

  test('should validate special characters correctly', () => {
    const { result: noSpecialResult } = renderHook(() => usePasswordValidation('password'));
    expect(noSpecialResult.current.hasSpecialChar).toBe(false);
    
    const { result: withSpecialResult } = renderHook(() => usePasswordValidation('password!'));
    expect(withSpecialResult.current.hasSpecialChar).toBe(true);
  });

  test('should validate password as valid when all criteria are met', () => {
    const { result } = renderHook(() => usePasswordValidation('Password!'));
    
    expect(result.current.hasMinLength).toBe(true);
    expect(result.current.hasUpperCase).toBe(true);
    expect(result.current.hasSpecialChar).toBe(true);
    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBe('');
  });

  test('should update validation when password changes', () => {
    const { result, rerender } = renderHook(
      (initialValue) => usePasswordValidation(initialValue), 
      { initialProps: 'weak' }
    );
    
    // Inicialmente debería fallar todas las validaciones
    expect(result.current.isValid).toBe(false);
    
    // Actualizar a una contraseña válida
    rerender('Strong@Password123');
    
    // Ahora debería pasar todas las validaciones
    expect(result.current.hasMinLength).toBe(true);
    expect(result.current.hasUpperCase).toBe(true);
    expect(result.current.hasSpecialChar).toBe(true);
    expect(result.current.isValid).toBe(true);
  });

  test('should set appropriate error message for invalid password', () => {
    // Falta longitud mínima
    const { result: shortResult } = renderHook(() => usePasswordValidation('Pass!'));
    expect(shortResult.current.error).toContain('mínimo 8 caracteres');
    
    // Falta mayúscula
    const { result: noUpperResult } = renderHook(() => usePasswordValidation('password!'));
    expect(noUpperResult.current.error).toContain('una mayúscula');
    
    // Falta carácter especial
    const { result: noSpecialResult } = renderHook(() => usePasswordValidation('Password'));
    expect(noSpecialResult.current.error).toContain('un carácter especial');
    
    // Faltan múltiples criterios
    const { result: multipleFailResult } = renderHook(() => usePasswordValidation('pass'));
    expect(multipleFailResult.current.error).toContain('mínimo 8 caracteres');
    expect(multipleFailResult.current.error).toContain('una mayúscula');
    expect(multipleFailResult.current.error).toContain('un carácter especial');
  });

  test('should validate password with validate function', () => {
    const { result } = renderHook(() => usePasswordValidation(''));
    
    // Validar una contraseña inválida
    act(() => {
      const isValid = result.current.validate('weak');
      expect(isValid).toBe(false);
    });
    
    expect(result.current.isValid).toBe(false);
    
    // Validar una contraseña válida
    act(() => {
      const isValid = result.current.validate('Strong@Password123');
      expect(isValid).toBe(true);
    });
    
    expect(result.current.isValid).toBe(true);
  });

  test('should recognize various special characters', () => {
    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', ',', '.', '?', '"', ':', '{', '}', '|', '<', '>'];
    
    specialChars.forEach(char => {
      const { result } = renderHook(() => usePasswordValidation(`Password${char}`));
      expect(result.current.hasSpecialChar).toBe(true);
    });
  });
});

import { useState, useEffect } from 'react';

interface PasswordValidation {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

export const usePasswordValidation = (value: string) => {
  const [validation, setValidation] = useState<PasswordValidation>({
    hasMinLength: false,
    hasUpperCase: false,
    hasSpecialChar: false,
    isValid: false
  });

  const [error, setError] = useState<string>('');

  const validate = (password: string) => {
    const validations = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isValid: false
    };

    validations.isValid = 
      validations.hasMinLength && 
      validations.hasUpperCase && 
      validations.hasSpecialChar;

    setValidation(validations);

    // Establecer mensaje de error
    if (password && !validations.isValid) {
      const errors = [];
      if (!validations.hasMinLength) errors.push('mínimo 8 caracteres');
      if (!validations.hasUpperCase) errors.push('una mayúscula');
      if (!validations.hasSpecialChar) errors.push('un carácter especial');
      
      setError(`La contraseña debe tener ${errors.join(', ')}`);
    } else {
      setError('');
    }

    return validations.isValid;
  };

  useEffect(() => {
    validate(value);
  }, [value]);

  return {
    ...validation,
    error,
    validate
  };
};

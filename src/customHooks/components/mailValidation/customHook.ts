import { useState, useEffect } from 'react';

export const useMailValidation = (value: string) => {
  const [error, setError] = useState<string>('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validate = (email: string) => {
    if (email && !validateEmail(email)) {
      setError('Correo electrónico invalido. Verifica e intenta de nuevo');
      return false;
    } else {
      setError('');
      return true;
    }
  };

  useEffect(() => {
    validate(value);
  }, [value]);

  return {
    error,
    validate,
    isValid: !error
  };
};

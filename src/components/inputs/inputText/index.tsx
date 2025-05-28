import { ChangeEvent } from 'react';
import { useMailValidation } from '../../../customHooks/components/mailValidation/customHook';
import './styled.css';

interface InputTextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  validation?: 'mail';
  error?: boolean;
  heightSize?: number;
  errorMessage?: string;
}

export const InputText = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  validation,
  heightSize,
  errorMessage
}: InputTextProps) => {
  // Siempre llamamos al hook, independientemente de la condición
  const mailValidationResult = useMailValidation(value);
  
  // Luego aplicamos la lógica condicional al resultado del hook
  const error = validation === 'mail' ? mailValidationResult.error : '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="input-text-container">
      <label className="input-text-label">{label}</label>
      {heightSize ? (
        <textarea
          className={`input-text input-text-resizable ${(error || errorMessage) ? 'input-text-error' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ height: `${heightSize}px` }}
        />
      ) : (
        <input
          type="text"
          className={`input-text ${(error || errorMessage) ? 'input-text-error' : ''}`}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="username"
        />
      )}
      {error && (
        <div className="input-text-error-container">
          <span className="input-text-error-icon">⚠</span>
          <span className="input-text-error-message">{error}</span>
        </div>
      )}
      {errorMessage && (
        <div className="input-text-error-container">
          <span className="input-text-error-message">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

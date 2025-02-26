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
}

export const InputText = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  validation,
  heightSize
}: InputTextProps) => {
  const { error } = validation === 'mail' 
    ? useMailValidation(value)
    : { error: '' };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="input-text-container">
      <label className="input-text-label">{label}</label>
      {heightSize ? (
        <textarea
          className={`input-text input-text-resizable ${error ? 'input-text-error' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ height: `${heightSize}px` }}
        />
      ) : (
        <input
          type="text"
          className={`input-text ${error ? 'input-text-error' : ''}`}
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
    </div>
  );
};

import { ChangeEvent, useState } from 'react';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import './styled.css';

interface InputPasswordProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  resetPass?: boolean;
  onResetClick?: () => void;
  errorMessage?: string;
}

export const InputPassword = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  resetPass = false,
  onResetClick,
  errorMessage
}: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="input-password-container">
      <div className="input-password-label-container">
        <label className="input-password-label">{label}</label>
        {resetPass && (
          <button 
            type="button" 
            className="reset-password-label"
            onClick={onResetClick}
          >
            Olvidé la contraseña
          </button>
        )}
      </div>
      <div className="input-password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          className={`input-password ${errorMessage ? 'input-password-error' : ''}`}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="input-password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <VisibilityOffOutlined style={{ fontSize: 22, color: 'black' }} />
          ) : (
            <VisibilityOutlined style={{ fontSize: 22, color: 'black' }} />
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="input-text-error-container">
          <span className="input-text-error-icon">⚠</span>
          <span className="input-text-error-message">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

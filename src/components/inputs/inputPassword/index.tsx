import { ChangeEvent, useState } from 'react';
import './styled.css';

interface InputPasswordProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  resetPass?: boolean;
  onResetClick?: () => void;
}

export const InputPassword = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  resetPass = false,
  onResetClick
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
          className="input-password"
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
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

    </div>
  );
};

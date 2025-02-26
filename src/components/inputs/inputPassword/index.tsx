import { ChangeEvent, useState } from 'react';
import './styled.css';

interface InputPasswordProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
}

export const InputPassword = ({ 
  label, 
  value, 
  onChange, 
  placeholder 
}: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="input-password-container">
      <label className="input-password-label">{label}</label>
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

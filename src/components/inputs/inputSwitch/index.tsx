import React from 'react';
import './styles.css';

interface SwitchInputProps {
  value: boolean;
  onChange?: (newValue: boolean) => void;
  disabled?: boolean;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({ 
  value, 
  onChange,
  disabled = false 
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!value);
    }
  };

  return (
    <div 
      className={`switch-container ${value ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      role="switch"
      aria-checked={value}
      tabIndex={disabled ? -1 : 0}
    >
      <div className="switch-ball" />
    </div>
  );
};

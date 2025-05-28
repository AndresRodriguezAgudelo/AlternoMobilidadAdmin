import React, { useState, useRef, useEffect } from 'react';
import { OptionType } from '../../../customHooks/components/inputSelectModal/customHook';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './styles.css';

export interface InputSelectDropdownSimpleProps {
  label?: string;
  options: OptionType[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const InputSelectDropdownSimple: React.FC<InputSelectDropdownSimpleProps> = ({
  label,
  options,
  value,
  placeholder = 'Todos',
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Encontrar la etiqueta a mostrar basada en el valor seleccionado
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = value ? (selectedOption ? selectedOption.label : value) : placeholder;

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="input-select-dropdown-simple" ref={dropdownRef}>
      {label && <label className="dropdown-simple-label">{label}</label>}
      <button 
        type="button" 
        className={`dropdown-simple-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir selector"
        aria-expanded={isOpen}
      >
        {displayLabel}
        <KeyboardArrowDownIcon className={isOpen ? 'rotate' : ''} />
      </button>
      
      {isOpen && (
        <div className="dropdown-simple-options">
          {options.map(opt => (
            <button
              type="button"
              key={opt.value}
              className={`dropdown-simple-item ${opt.value === value ? 'selected' : ''}`}
              onClick={() => { 
                onChange(opt.value); 
                setIsOpen(false); 
              }}
              aria-label={`Seleccionar ${opt.label}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

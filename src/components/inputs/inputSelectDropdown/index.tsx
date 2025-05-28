import React, { useState, useRef, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './styles.css';

// Definición de la estructura de las opciones
export interface OptionType {
  label: string;
  value: string;
}

export interface InputSelectDropdownProps {
  label?: string;
  options: OptionType[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const InputSelectDropdown: React.FC<InputSelectDropdownProps> = ({
  label,
  options,
  value,
  placeholder = 'Seleccionar',
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Encontrar la etiqueta a mostrar basada en el valor seleccionado
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

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
    <div className="input-select-dropdown" ref={dropdownRef}>
      {label && <label className="dropdown-label">{label}</label>}
      <button 
        type="button" 
        className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir selector"
        aria-expanded={isOpen}
      >
        {displayLabel}
        <KeyboardArrowDownIcon className={isOpen ? 'rotate' : ''} />
      </button>
      
      {isOpen && (
        <div className="dropdown-options">
          {options.map(opt => (
            <button
              type="button"
              key={opt.value}
              className={`dropdown-item ${opt.value === value ? 'selected' : ''}`}
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

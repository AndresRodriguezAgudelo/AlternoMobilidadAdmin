import React, { useState } from 'react';
import { Modal } from '../../modal';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './styles.css';

// Definición de la estructura de las opciones
export interface OptionType {
  label: string;
  value: string;
}

export interface InputSelectModalProps {
  label?: string;
  options: OptionType[];
  value: string;
  placeholder?: string;
  titleOfModal?: string;
  onChange: (value: string) => void;
}

export const InputSelectModal: React.FC<InputSelectModalProps> = ({
  label,
  options,
  value,
  placeholder = 'Seleccionar',
  titleOfModal = '',
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Encontrar la etiqueta a mostrar basada en el valor seleccionado
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="input-select-modal-static">
      {label && <label className="simple-label-static">{label}</label>}
      <button 
        type="button" 
        className="simple-trigger-static" 
        onClick={() => setIsOpen(true)}
        aria-label="Abrir selector"
      >
        {displayLabel}
        <KeyboardArrowDownIcon />
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={titleOfModal || ''}>
        <div className="simple-list-static">
          {options.map(opt => (
            <button
              type="button"
              key={opt.value}
              className="simple-item-static"
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              aria-label={`Seleccionar ${opt.label}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

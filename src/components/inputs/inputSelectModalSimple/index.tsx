import React, { useState } from 'react';
import { Modal } from '../../modal';
import { OptionType } from '../../../customHooks/components/inputSelectModal/customHook';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './styles.css';

export interface InputSelectModalSimpleProps {
  label?: string;
  options: OptionType[];
  value: string;
  placeholder?: string;
  titleOfModal?: string;
  onChange: (value: string) => void;
}

export const InputSelectModalSimple: React.FC<InputSelectModalSimpleProps> = ({
  label,
  options,
  value,
  placeholder = 'Seleccionar',
  titleOfModal = '',
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const displayLabel = value || placeholder;

  return (
    <div className="input-select-modal-simple">
      {label && <label className="simple-label">{label}</label>}
      <div 
        className="simple-trigger" 
        onClick={() => setIsOpen(true)} 
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          // Permitir activación con Enter o Space
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {displayLabel}
        <KeyboardArrowDownIcon />
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={titleOfModal || ''}>
        <div className="simple-list">
          {options.map(opt => (
            <div
              key={opt.value}
              className="simple-item"
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(opt.value);
                  setIsOpen(false);
                }
              }}
              aria-selected={opt.value === value}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

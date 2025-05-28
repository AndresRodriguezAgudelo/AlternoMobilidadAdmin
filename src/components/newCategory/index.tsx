import React from 'react';
import { Modal } from '../modal';
import { InputText } from '../inputs/inputText';
import './styles.css';
import { Button } from '../buttons/simpleButton';

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  onNameChange: (value: string) => void;
  onAdd: () => void;
  loading: boolean;
  error: string | null;
}

export const NewCategoryModal: React.FC<NewCategoryModalProps> = ({ isOpen, onClose, name, onNameChange, onAdd, loading, error }) => {
  if (!isOpen) return null;
  return (
    <Modal className="new-category-modal" isOpen={isOpen} onClose={onClose} title="Nueva Categoría">
      <div className="new-category-form">
        <InputText
          label="Nombre"
          value={name}
          placeholder="Ingrese el nombre"
          onChange={onNameChange}
        />
        {error && <div className="new-category-error">{error}</div>}
        <br/>
        <Button
          className="add-category-button"
          onClick={onAdd}
          disabled={loading}
          label={loading ? 'Guardando...' : 'Agregar Categoría'}
        />
      </div>
    </Modal>
  );
};

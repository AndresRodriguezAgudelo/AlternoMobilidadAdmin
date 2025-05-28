import { useState } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';

export const useNewCategoryModal = (onSuccess: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleAdd = async () => {
    if (!name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post(ENDPOINTS.CATEGORIES.LIST, { categoryName: name });
      setName('');
      closeModal();
      onSuccess();
    } catch (e) {
      console.error('Error creando categoría:', e);
      setError('Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    name,
    setName,
    openModal,
    closeModal,
    handleAdd,
    loading,
    error,
  };
};

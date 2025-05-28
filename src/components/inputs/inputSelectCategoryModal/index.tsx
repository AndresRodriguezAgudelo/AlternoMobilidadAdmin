import React, { useState } from 'react';
import { useInputSelectModal, OptionType } from '../../../customHooks/components/inputSelectModal/customHook';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MenuIcon from '@mui/icons-material/Menu';

import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';
import { Modal } from '../../modal';
import { useNewCategoryModal } from '../../../customHooks/components/newCategory/customHook';
import { NewCategoryModal } from '../../newCategory';
import { showConfirmationModal } from '../../confirmationModal';

import './styles.css';
import { FatButton } from '../../buttons/fatButton';

// Constante que define el número máximo de categorías permitidas
const MAX_CATEGORIES = 12;

export interface InputSelectModalProps {
  label?: string;
  options: OptionType[];
  value: string;
  onChange: (value: string) => void;
  onDelete?: (value: string) => void;
  onReorder?: (newOrder: OptionType[]) => void;
  placeholder?: string;
  onAddCategorySuccess?: () => void;
  error?: boolean;
  errorMessage?: string;
}

export const InputSelectModal: React.FC<InputSelectModalProps> = ({ label, options, value, onChange, onDelete, onReorder, placeholder, onAddCategorySuccess, error, errorMessage }) => {
  // Estado para controlar la carga durante la actualización del orden (implementación futura si se necesita)
  // const [orderLoading, setOrderLoading] = useState(false);
  // Función para actualizar el orden de categorías en el backend
  const updateCategoryOrder = async (newOrder: OptionType[]) => {
    // Aquí podría ir un indicador de carga si se necesita
    try {
      // Extraer los IDs de las categorías en el nuevo orden
      const categoryIds = newOrder.map(item => parseInt(item.value));
      
      //('[updateCategoryOrder] Enviando orden PUT:', categoryIds);
      
      // Realizar la petición PUT al backend
      await api.put(ENDPOINTS.CATEGORIES.ORDER_LIST, { categoryIds });
      
    } catch (error) {} 
  };

  // Wrapper para la función updateCategoryOrder que no devuelve una promesa
  const handleReorder = (newOrder: OptionType[]) => {
    // Ejecutar la función asíncrona sin esperar su resultado
    void updateCategoryOrder(newOrder);
    // Si hay una función onReorder proporcionada como prop, llamarla directamente
    if (onReorder) {
      onReorder(newOrder);
    }
  };

  const {
    isOpen,
    items,
    selectedLabel,
    openModal,
    closeModal,
    handleDragStart,
    handleDragEnter,
    handleDragEnd: originalHandleDragEnd,
    handleSelect,
    handleDeleteClick,
  } = useInputSelectModal({ 
    options, 
    value, 
    onChange, 
    onDelete,
    onReorder: handleReorder, // Pasar el wrapper que no devuelve promesa
    placeholder 
  });
  
  // Sobreescribir handleDragEnd para mostrar un indicador de carga
  const handleDragEnd = () => {
    originalHandleDragEnd();
  };

  const {
    isOpen: isNewOpen,
    openModal: openNewModal,
    closeModal: closeNewModal,
    name,
    setName,
    handleAdd,
    loading: newLoading,
    error: newError,
  } = useNewCategoryModal(onAddCategorySuccess ?? (() => {}));

  // estado para confirm delete
  const [deleteLoading, setDeleteLoading] = useState(false);




  return (
    <>
    <div>
      {label && <label className="select-modal-label">{label}</label>}
      <div 
        className={`input-select-modal-trigger ${error ? 'input-select-modal-error' : ''}`} 
        onClick={openModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          // Permitir activación con Enter o Space
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {selectedLabel}
      </div>
      {error && errorMessage && (
        <div className="input-select-modal-error-message">
          {errorMessage}
        </div>
      )}
    </div>
      <div className="input-select-modal">
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title="Mantén presionado la categoría para arrastrarla y reorganizar su posición en la app"
        >
          <div className="select-modal-list">
            {items.map((item, index) => (
              <div
                key={item.value}
                className="select-modal-item"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onClick={() => handleSelect(item.value)}
                role="button" 
              >
                <div className="item-id-circle">{index + 1}</div>
                <span className="item-label">{item.label}</span>
                <div className="item-actions">
                  <DeleteOutlineIcon
                    className="delete-icon"
                    style={{ color: 'red' }}
                    onClick={e => {
                      e.stopPropagation();
                      showConfirmationModal({
                        title: '¿Estás seguro de que deseas eliminar esta categoría?',
                        content: 'Las guías asociadas a ella deberán asignarse a otra categoría o no estarán visibles en la app. Esta acción es irreversible.',
                        buttonText: deleteLoading ? 'Eliminando...' : 'Confirmar',
                        onAction: () => {
                          // Usar un IIFE (Immediately Invoked Function Expression) para manejar la asincronía
                          // sin devolver una promesa en la función onAction
                          (async () => {
                            setDeleteLoading(true);
                            try {
                              await api.delete(`${ENDPOINTS.CATEGORIES.LIST}/${item.value}`);
                              handleDeleteClick(item.value);
                            } catch (e) {
                              console.error('Error al eliminar categoría:', e);
                            } finally {
                              setDeleteLoading(false);
                            }
                          })();
                        }
                      });
                    }}
                  />
                  <MenuIcon className="drag-handle" />
                </div>
              </div>
            ))}
          </div>
          <br />
          <div className='add-category-footer'>
          <FatButton 
            label="Agregar categoría +"
            backgroundColor="white"
            textColor="rgb(46, 168, 224)"
            onClick={() => {
              // Verificar si se ha alcanzado el número máximo de categorías
              if (items.length >= MAX_CATEGORIES) {
                showConfirmationModal({
                  title: 'Límite de categorías alcanzado',
                  content: `Has alcanzado el número máximo de categorías permitidas (${MAX_CATEGORIES}). Para agregar una nueva categoría, debes eliminar alguna existente.`,
                  buttonText: 'Entendido',
                  onAction: () => {},
                  showCancelButton: false
                });
              } else {
                openNewModal();
              }
            }}
          />
          </div>

        </Modal>
      </div>
      <NewCategoryModal
        isOpen={isNewOpen}
        onClose={closeNewModal}
        name={name}
        onNameChange={setName}
        onAdd={handleAdd}
        loading={newLoading}
        error={newError}
      />
    </>
  );
};

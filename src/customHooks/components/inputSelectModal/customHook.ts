import { useState, useRef, useEffect } from 'react';

export interface OptionType {
  label: string;
  value: string;
}

export interface UseInputSelectModalProps {
  options: OptionType[];
  value: string;
  onChange: (value: string) => void;
  onDelete?: (value: string) => void;
  onReorder?: (newOrder: OptionType[]) => void;
  placeholder?: string;
}

export const useInputSelectModal = ({
  options: initialOptions,
  value,
  onChange,
  onDelete,
  onReorder,
  placeholder = 'Selecciona una opción',
}: UseInputSelectModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<OptionType[]>(initialOptions);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Sincronizar items cuando cambian opciones
  useEffect(() => {
    setItems(initialOptions);
  }, [initialOptions]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null) return;
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setItems(updated);
    onReorder && onReorder(updated);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSelect = (val: string) => {
    onChange(val);
    closeModal();
  };

  const handleDeleteClick = (val: string) => {
    onDelete && onDelete(val);
    setItems(prev => prev.filter(item => item.value !== val));
  };

  const selectedLabel = items.find(item => item.value === value)?.label || placeholder;

  return {
    isOpen,
    items,
    openModal,
    closeModal,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleSelect,
    handleDeleteClick,
    selectedLabel,
  };
};

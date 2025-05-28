import { renderHook, act } from '@testing-library/react';
import { useInputSelectModal, OptionType } from '../src/customHooks/components/inputSelectModal/customHook';

describe('useInputSelectModal Hook', () => {
  const mockOptions: OptionType[] = [
    { label: 'Opción 1', value: 'option1' },
    { label: 'Opción 2', value: 'option2' },
    { label: 'Opción 3', value: 'option3' }
  ];
  
  const mockOnChange = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnReorder = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useInputSelectModal({
      options: mockOptions,
      value: '',
      onChange: mockOnChange
    }));
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.items).toEqual(mockOptions);
    expect(result.current.selectedLabel).toBe('Selecciona una opción');
  });
  
  test('should initialize with custom placeholder', () => {
    const customPlaceholder = 'Selecciona algo';
    const { result } = renderHook(() => useInputSelectModal({
      options: mockOptions,
      value: '',
      onChange: mockOnChange,
      placeholder: customPlaceholder
    }));
    
    expect(result.current.selectedLabel).toBe(customPlaceholder);
  });
  
  test('should show selected option label when value is set', () => {
    const { result } = renderHook(() => useInputSelectModal({
      options: mockOptions,
      value: 'option2',
      onChange: mockOnChange
    }));
    
    expect(result.current.selectedLabel).toBe('Opción 2');
  });
  
  test('should open and close modal', () => {
    const { result } = renderHook(() => useInputSelectModal({
      options: mockOptions,
      value: '',
      onChange: mockOnChange
    }));
    
    expect(result.current.isOpen).toBe(false);
    
    act(() => {
      result.current.openModal();
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.closeModal();
    });
    
    expect(result.current.isOpen).toBe(false);
  });
  
  test('should handle option selection', () => {
    const { result } = renderHook(() => useInputSelectModal({
      options: mockOptions,
      value: '',
      onChange: mockOnChange
    }));
    
    act(() => {
      result.current.handleSelect('option3');
    });
    
    expect(mockOnChange).toHaveBeenCalledWith('option3');
    expect(result.current.isOpen).toBe(false);
  });
  
  test('should handle option deletion', () => {
    const { result } = renderHook(() => useInputSelectModal({
      options: mockOptions,
      value: '',
      onChange: mockOnChange,
      onDelete: mockOnDelete
    }));
    
    act(() => {
      result.current.handleDeleteClick('option2');
    });
    
    expect(mockOnDelete).toHaveBeenCalledWith('option2');
    expect(result.current.items).toHaveLength(2);
    expect(result.current.items.find(item => item.value === 'option2')).toBeUndefined();
  });
  
  test('should handle drag and drop reordering', () => {
    const { result } = renderHook(() => useInputSelectModal({
      options: mockOptions,
      value: '',
      onChange: mockOnChange,
      onReorder: mockOnReorder
    }));
    
    act(() => {
      result.current.handleDragStart(0);
      result.current.handleDragEnter(2);
      result.current.handleDragEnd();
    });
    
    // Verificar que onReorder fue llamado con el nuevo orden
    expect(mockOnReorder).toHaveBeenCalled();
    
    // Verificar que el primer elemento ahora está en la posición 2
    const expectedOrder = [
      { label: 'Opción 2', value: 'option2' },
      { label: 'Opción 3', value: 'option3' },
      { label: 'Opción 1', value: 'option1' }
    ];
    
    expect(mockOnReorder).toHaveBeenCalledWith(expectedOrder);
  });
  
  test('should update items when options change', () => {
    const { result, rerender } = renderHook(
      (props) => useInputSelectModal(props),
      {
        initialProps: {
          options: mockOptions,
          value: '',
          onChange: mockOnChange
        }
      }
    );
    
    expect(result.current.items).toEqual(mockOptions);
    
    const newOptions: OptionType[] = [
      { label: 'Nueva Opción 1', value: 'new1' },
      { label: 'Nueva Opción 2', value: 'new2' }
    ];
    
    rerender({
      options: newOptions,
      value: '',
      onChange: mockOnChange
    });
    
    expect(result.current.items).toEqual(newOptions);
  });
  
  test('should not call onReorder if drag and drop indices are invalid', () => {
    const { result } = renderHook(() => useInputSelectModal({
      options: mockOptions,
      value: '',
      onChange: mockOnChange,
      onReorder: mockOnReorder
    }));
    
    // No llamamos a handleDragStart, dejando dragItem.current como null
    act(() => {
      result.current.handleDragEnter(2);
      result.current.handleDragEnd();
    });
    
    expect(mockOnReorder).not.toHaveBeenCalled();
  });
});

/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { showConfirmationModal } from '../src/components/confirmationModal';

// Mock para InfoOutlinedIcon
jest.mock('@mui/icons-material/InfoOutlined', () => {
  return function DummyInfoOutlinedIcon() {
    return <div data-testid="info-icon" />;
  };
});

// Mock para Button
jest.mock('../src/components/buttons/simpleButton', () => ({
  Button: ({ label, onClick }) => <button onClick={onClick}>{label}</button>
}));

// Mock para setTimeout
jest.useFakeTimers();

// Mock para react-dom/client
const mockRender = jest.fn();
const mockUnmount = jest.fn();
const mockRemove = jest.fn();

jest.mock('react-dom/client', () => ({
  createRoot: () => ({
    render: mockRender,
    unmount: mockUnmount
  })
}));

describe('ConfirmationModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Crear un mock para el método remove del elemento container
    Element.prototype.remove = mockRemove;
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllTimers();
  });

  
  test('showConfirmationModal crea un contenedor y renderiza el modal', () => {
    // Espiar document.createElement y appendChild
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    
    // Función onAction para testear
    const mockOnAction = jest.fn();
    
    // Llamar a la función
    showConfirmationModal({
      title: 'Test Modal',
      content: 'This is a test',
      buttonText: 'OK',
      onAction: mockOnAction
    });
    
    // Verificar que se creó un div y se añadió al body
    expect(createElementSpy).toHaveBeenCalledWith('div');
    expect(appendChildSpy).toHaveBeenCalled();
    
    // Verificar que se llamó a render
    expect(mockRender).toHaveBeenCalled();
    
    // Verificar que el componente se renderizó con los props correctos
    const renderedComponent = mockRender.mock.calls[0][0];
    expect(renderedComponent.props.title).toBe('Test Modal');
    expect(renderedComponent.props.content).toBe('This is a test');
    expect(renderedComponent.props.buttonText).toBe('OK');
    
    // Simular que se hace clic en el botón de acción
    renderedComponent.props.onAction();
    
    // Avanzar el tiempo para que se ejecute el setTimeout
    jest.runAllTimers();
    
    // Verificar que se llamó a unmount y remove
    expect(mockUnmount).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalled();
    
    // Verificar que se llamó a onAction
    expect(mockOnAction).toHaveBeenCalled();
    
    // Restaurar los mocks
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
  });
  
  test('showConfirmationModal maneja correctamente el onCancel', () => {
    // Espiar document.createElement y appendChild
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    
    // Llamar a la función
    showConfirmationModal({
      title: 'Test Modal',
      content: 'This is a test',
      buttonText: 'OK',
      showCancelButton: true
    });
    
    // Verificar que el componente se renderizó
    expect(mockRender).toHaveBeenCalled();
    
    // Obtener el componente renderizado
    const renderedComponent = mockRender.mock.calls[0][0];
    
    // Simular que se hace clic en el botón de cancelar
    renderedComponent.props.onCancel();
    
    // Avanzar el tiempo para que se ejecute el setTimeout
    jest.runAllTimers();
    
    // Verificar que se llamó a unmount y remove
    expect(mockUnmount).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalled();
    
    // Restaurar los mocks
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
  });
  
  test('showConfirmationModal maneja correctamente cuando onAction no está definido', () => {
    // Espiar document.createElement y appendChild
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    
    // Llamar a la función sin onAction
    showConfirmationModal({
      title: 'Test Modal',
      content: 'This is a test',
      buttonText: 'OK'
      // onAction no definido intencionalmente
    });
    
    // Obtener el componente renderizado
    const renderedComponent = mockRender.mock.calls[0][0];
    
    // Simular que se hace clic en el botón de acción
    // Esto no debería causar error aunque onAction no esté definido
    expect(() => {
      renderedComponent.props.onAction();
      jest.runAllTimers();
    }).not.toThrow();
    
    // Verificar que se llamó a unmount y remove
    expect(mockUnmount).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalled();
    
    // Restaurar los mocks
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
  });
  
  test('showConfirmationModal con showCancelButton=false no muestra el botón de cancelar', () => {
    // Espiar document.createElement y appendChild
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    
    // Llamar a la función con showCancelButton=false
    showConfirmationModal({
      title: 'Test Modal',
      content: 'This is a test',
      buttonText: 'OK',
      showCancelButton: false
    });
    
    // Verificar que el componente se renderizó
    expect(mockRender).toHaveBeenCalled();
    
    // Obtener el componente renderizado
    const renderedComponent = mockRender.mock.calls[0][0];
    
    // Verificar que showCancelButton es false
    expect(renderedComponent.props.showCancelButton).toBe(false);
    
    // Restaurar los mocks
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
  });
});

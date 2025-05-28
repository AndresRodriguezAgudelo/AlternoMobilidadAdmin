/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputSelectDropdownSimple } from '../src/components/inputs/inputSelectDropdownSimple';

// Mock para el ícono
jest.mock('@mui/icons-material/KeyboardArrowDown', () => {
  return function DummyKeyboardArrowDownIcon(props) {
    return <div data-testid="arrow-icon" className={props.className} />;
  };
});

describe('InputSelectDropdownSimple', () => {
  const mockOptions = [
    { label: 'Opción 1', value: 'opt1' },
    { label: 'Opción 2', value: 'opt2' },
    { label: 'Opción 3', value: 'opt3' }
  ];
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente con valor seleccionado', () => {
    render(
      <InputSelectDropdownSimple
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Opción 1')).toBeInTheDocument();
  });

  it('renderiza correctamente con placeholder cuando no hay valor', () => {
    render(
      <InputSelectDropdownSimple
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('TODOS')).toBeInTheDocument();
  });

  it('renderiza correctamente con placeholder personalizado', () => {
    render(
      <InputSelectDropdownSimple
        options={mockOptions}
        value=""
        placeholder="Seleccionar"
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Seleccionar')).toBeInTheDocument();
  });

  it('renderiza correctamente con etiqueta', () => {
    render(
      <InputSelectDropdownSimple
        label="Categoría"
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Categoría')).toBeInTheDocument();
  });

  it('abre el menú desplegable al hacer clic en el botón', () => {
    render(
      <InputSelectDropdownSimple
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />
    );
    
    // El menú no debe estar visible inicialmente
    expect(screen.queryByText('Opción 2')).not.toBeInTheDocument();
    
    // Hacer clic en el botón para abrir el menú (usando aria-label para ser más específico)
    fireEvent.click(screen.getByRole('button', { name: /Abrir selector/i }));
    
    // Ahora todas las opciones deben ser visibles
    // Usamos getAllByText para verificar que hay al menos una opción con cada texto
    expect(screen.getAllByText('Opción 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Opción 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Opción 3').length).toBeGreaterThan(0);
  });

  it('cierra el menú desplegable al seleccionar una opción', () => {
    render(
      <InputSelectDropdownSimple
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />
    );
    
    // Abrir el menú
    fireEvent.click(screen.getByRole('button', { name: /Abrir selector/i }));
    
    // Seleccionar otra opción (usando aria-label para ser más específico)
    fireEvent.click(screen.getByRole('button', { name: /Seleccionar Opción 2/i }));
    
    // Verificar que se llamó a onChange con el valor correcto
    expect(mockOnChange).toHaveBeenCalledWith('opt2');
    
    // El menú debe estar cerrado
    expect(screen.queryByText('Opción 3')).not.toBeInTheDocument();
  });

  it('cierra el menú desplegable al hacer clic fuera del componente', () => {
    render(
      <>
        <div data-testid="outside-element">Fuera del componente</div>
        <InputSelectDropdownSimple
          options={mockOptions}
          value="opt1"
          onChange={mockOnChange}
        />
      </>
    );
    
    // Abrir el menú
    fireEvent.click(screen.getByRole('button', { name: /Abrir selector/i }));
    
    // Verificar que el menú está abierto
    expect(screen.getAllByText('Opción 2').length).toBeGreaterThan(0);
    
    // Hacer clic fuera del componente
    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    
    // Verificar que el menú se cerró
    expect(screen.queryByText('Opción 2')).not.toBeInTheDocument();
  });

  it('rota el ícono cuando el menú está abierto', () => {
    render(
      <InputSelectDropdownSimple
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />
    );
    
    // Inicialmente el ícono no debe tener la clase 'rotate'
    const arrowIcon = screen.getByTestId('arrow-icon');
    expect(arrowIcon).not.toHaveClass('rotate');
    
    // Abrir el menú
    fireEvent.click(screen.getByRole('button', { name: /Abrir selector/i }));
    
    // Ahora el ícono debe tener la clase 'rotate'
    expect(arrowIcon).toHaveClass('rotate');
  });

  it('muestra el valor directamente cuando no coincide con ninguna opción', () => {
    render(
      <InputSelectDropdownSimple
        options={mockOptions}
        value="valor-no-existente"
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('valor-no-existente')).toBeInTheDocument();
  });

  it('limpia el evento al desmontar el componente', () => {
    // Espiar document.removeEventListener
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(
      <InputSelectDropdownSimple
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />
    );
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });

  it('mantiene el estado abierto/cerrado correctamente', () => {
    render(
      <InputSelectDropdownSimple
        options={mockOptions}
        value="opt1"
        onChange={mockOnChange}
      />
    );
    
    // Verificar que el botón tiene el atributo aria-expanded=false inicialmente
    const button = screen.getByRole('button', { name: /Abrir selector/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    
    // Abrir el menú
    fireEvent.click(button);
    
    // Verificar que el botón ahora tiene aria-expanded=true
    expect(button).toHaveAttribute('aria-expanded', 'true');
    
    // Verificar que el botón tiene la clase 'active'
    expect(button).toHaveClass('active');
    
    // Cerrar el menú
    fireEvent.click(button);
    
    // Verificar que el botón vuelve a tener aria-expanded=false
    expect(button).toHaveAttribute('aria-expanded', 'false');
    
    // Verificar que el botón ya no tiene la clase 'active'
    expect(button).not.toHaveClass('active');
  });
});

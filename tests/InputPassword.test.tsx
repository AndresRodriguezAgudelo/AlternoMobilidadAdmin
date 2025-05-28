import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputPassword } from '../src/components/inputs/inputPassword';
import { useInputPassword } from '../src/customHooks/components/inputPassword/customHook';

// Mock del hook useInputPassword
jest.mock('../src/customHooks/components/inputPassword/customHook', () => ({
  useInputPassword: jest.fn()
}));

// Mock de los componentes de Material UI
jest.mock('@mui/icons-material', () => ({
  VisibilityOutlined: () => <div data-testid="visibility-icon">Visibility</div>,
  VisibilityOffOutlined: () => <div data-testid="visibility-off-icon">VisibilityOff</div>
}));

describe('InputPassword Component', () => {
  // Configuración por defecto para cada test
  beforeEach(() => {
    // Configurar el mock del hook
    (useInputPassword as jest.Mock).mockReturnValue({
      loading: false,
      handleForgotPassword: jest.fn()
    });
  });

  test('renders with label', () => {
    render(
      <InputPassword 
        label="Contraseña" 
        value="" 
        onChange={() => {}} 
      />
    );
    
    // Verificar que el label se renderiza correctamente
    expect(screen.getByText('Contraseña')).toBeInTheDocument();
  });

  test('toggles password visibility when button is clicked', () => {
    render(
      <InputPassword 
        label="Contraseña" 
        value="test123" 
        onChange={() => {}} 
        placeholder="Ingresa tu contraseña"
      />
    );
    
    // Inicialmente el tipo debe ser "password"
    const inputElement = screen.getByPlaceholderText('Ingresa tu contraseña') as HTMLInputElement;
    expect(inputElement.type).toBe('password');
    
    // Hacer clic en el botón de visibilidad
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    // Después del clic, el tipo debe ser "text"
    expect(inputElement.type).toBe('text');
  });

  test('shows reset password button when resetPass is true', () => {
    render(
      <InputPassword 
        label="Contraseña" 
        value="" 
        onChange={() => {}} 
        resetPass={true}
      />
    );
    
    // Verificar que el botón "Olvidé la contraseña" está presente
    expect(screen.getByText('Olvidé la contraseña')).toBeInTheDocument();
  });

  test('does not show reset password button when resetPass is false', () => {
    render(
      <InputPassword 
        label="Contraseña" 
        value="" 
        onChange={() => {}} 
        resetPass={false}
      />
    );
    
    // Verificar que el botón "Olvidé la contraseña" no está presente
    expect(screen.queryByText('Olvidé la contraseña')).not.toBeInTheDocument();
  });

  test('calls onChange when input value changes', () => {
    const handleChange = jest.fn();
    
    render(
      <InputPassword 
        label="Contraseña" 
        value="" 
        onChange={handleChange} 
        placeholder="Ingresa tu contraseña"
      />
    );
    
    // Simular cambio en el input
    const inputElement = screen.getByPlaceholderText('Ingresa tu contraseña');
    fireEvent.change(inputElement, { target: { value: 'nueva-contraseña' } });
    
    // Verificar que se llamó a la función onChange
    expect(handleChange).toHaveBeenCalledWith('nueva-contraseña');
  });

  test('shows error message when provided', () => {
    render(
      <InputPassword 
        label="Contraseña" 
        value="" 
        onChange={() => {}} 
        errorMessage="La contraseña es obligatoria"
      />
    );
    
    // Verificar que el mensaje de error se muestra
    expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
  });

  test('calls onResetClick when reset password button is clicked', () => {
    const handleResetClick = jest.fn();
    
    render(
      <InputPassword 
        label="Contraseña" 
        value="" 
        onChange={() => {}} 
        resetPass={true}
        onResetClick={handleResetClick}
      />
    );
    
    // Hacer clic en el botón "Olvidé la contraseña"
    const resetButton = screen.getByText('Olvidé la contraseña');
    fireEvent.click(resetButton);
    
    // Verificar que se llamó a la función onResetClick
    expect(handleResetClick).toHaveBeenCalled();
  });

  test('calls handleForgotPassword when reset button is clicked and no onResetClick provided', () => {
    const mockHandleForgotPassword = jest.fn();
    (useInputPassword as jest.Mock).mockReturnValue({
      loading: false,
      handleForgotPassword: mockHandleForgotPassword
    });
    
    render(
      <InputPassword 
        label="Contraseña" 
        value="" 
        onChange={() => {}} 
        resetPass={true}
      />
    );
    
    // Hacer clic en el botón "Olvidé la contraseña"
    const resetButton = screen.getByText('Olvidé la contraseña');
    fireEvent.click(resetButton);
    
    // Verificar que se llamó a handleForgotPassword
    expect(mockHandleForgotPassword).toHaveBeenCalled();
  });

  test('disables reset button when loading is true', () => {
    (useInputPassword as jest.Mock).mockReturnValue({
      loading: true,
      handleForgotPassword: jest.fn()
    });
    
    render(
      <InputPassword 
        label="Contraseña" 
        value="" 
        onChange={() => {}} 
        resetPass={true}
      />
    );
    
    // Verificar que el botón está deshabilitado
    const resetButton = screen.getByText('Enviando...');
    expect(resetButton).toBeDisabled();
  });
});

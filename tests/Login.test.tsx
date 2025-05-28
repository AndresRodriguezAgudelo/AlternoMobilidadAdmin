import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../src/pages/Login';
import { useLogin } from '../src/customHooks/pages/login/customHook';
import { useInputPassword } from '../src/customHooks/components/inputPassword/customHook';

// Mock de los hooks personalizados
jest.mock('../src/customHooks/pages/login/customHook', () => ({
  useLogin: jest.fn()
}));

jest.mock('../src/customHooks/components/inputPassword/customHook', () => ({
  useInputPassword: jest.fn()
}));

// Mock de los componentes utilizados en Login
jest.mock('../src/components/inputs/inputText', () => ({
  InputText: ({ label, value, onChange, errorMessage }) => (
    <div>
      <label>{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        data-testid="input-text"
      />
      {errorMessage && <span>{errorMessage}</span>}
    </div>
  )
}));

jest.mock('../src/components/inputs/inputPassword', () => ({
  InputPassword: ({ label, value, onChange, resetPass, onResetClick, errorMessage }) => (
    <div>
      <label>{label}</label>
      <input 
        type="password" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        data-testid="input-password"
      />
      {resetPass && (
        <button 
          onClick={onResetClick} 
          data-testid="reset-password-button"
        >
          Olvidé la contraseña
        </button>
      )}
      {errorMessage && <span>{errorMessage}</span>}
    </div>
  )
}));

jest.mock('../src/components/inputs/inputCheckBox', () => ({
  InputCheckBox: ({ checked, onChange }) => (
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={(e) => onChange(e.target.checked)} 
      data-testid="input-checkbox"
    />
  )
}));

jest.mock('../src/components/buttons/simpleButton', () => ({
  Button: ({ label, onClick, disabled, type }) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      type={type} 
      data-testid="submit-button"
    >
      {label}
    </button>
  )
}));

// Mock de las imágenes
jest.mock('../src/assets/images/LogoMobilityAZUL.png', () => 'mock-logo');
jest.mock('../src/assets/images/LoginBackgroundImage.png', () => 'mock-background');

describe('Login Page', () => {
  // Configuración por defecto para cada test
  beforeEach(() => {
    // Configurar los mocks de los hooks
    (useLogin as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: null,
      altForm: { field1: '', field2: '' },
      setAltForm: jest.fn(),
      handleAltFormSubmit: jest.fn()
    });
    
    (useInputPassword as jest.Mock).mockReturnValue({
      handleForgotPassword: jest.fn(),
      loading: false,
      error: null
    });

    // Limpiar el localStorage y sessionStorage antes de cada test
    localStorage.clear();
    sessionStorage.clear();
    
    // Limpiar la URL
    window.history.pushState({}, 'Test page', '/login');
  });

  test('renders login form when no URL parameters are present', () => {
    render(<Login />);
    
    // Verificar que se muestra el formulario de login
    expect(screen.getByText('Portal de administración')).toBeInTheDocument();
    expect(screen.getByTestId('input-text')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('input-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('calls login function when form is submitted', async () => {
    const mockLogin = jest.fn();
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
      altForm: { field1: '', field2: '' },
      setAltForm: jest.fn(),
      handleAltFormSubmit: jest.fn()
    });
    
    render(<Login />);
    
    // Llenar el formulario
    const emailInput = screen.getByTestId('input-text');
    const passwordInput = screen.getByTestId('input-password');
    const checkbox = screen.getByTestId('input-checkbox');
    const submitButton = screen.getByTestId('submit-button');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(checkbox);
    
    // Enviar el formulario
    fireEvent.click(submitButton);
    
    // Verificar que se llamó a la función login con las credenciales correctas
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('calls handleForgotPassword when reset password button is clicked', () => {
    const mockHandleForgotPassword = jest.fn();
    (useInputPassword as jest.Mock).mockReturnValue({
      handleForgotPassword: mockHandleForgotPassword,
      loading: false,
      error: null
    });
    
    render(<Login />);
    
    // Hacer clic en el botón "Olvidé la contraseña"
    const resetButton = screen.getByTestId('reset-password-button');
    fireEvent.click(resetButton);
    
    // Verificar que se llamó a la función handleForgotPassword
    expect(mockHandleForgotPassword).toHaveBeenCalled();
  });

  test('renders password reset form when URL parameters are present', () => {
    // Simular parámetros en la URL
    window.history.pushState({}, 'Test page', '/login?id=123&auth=1746863376');
    
    // Forzar la lectura de los parámetros de URL
    const searchParams = new URLSearchParams(window.location.search);
    const idParam = searchParams.get('id');
    const authParam = searchParams.get('auth');
    
    // Configurar el mock de useLogin para simular que se detectaron los parámetros
    (useLogin as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: null,
      altForm: { field1: '', field2: '' },
      setAltForm: jest.fn(),
      handleAltFormSubmit: jest.fn()
    });
    
    // Renderizar el componente con los parámetros simulados
    const { container } = render(<Login />);
    
    // Verificar que se muestra el formulario de cambio de contraseña
    expect(screen.getByText('Cambio de contraseña')).toBeInTheDocument();
    
    // Verificar que hay dos campos de contraseña
    const passwordInputs = screen.getAllByTestId('input-password');
    expect(passwordInputs.length).toBe(2);
  });

  test('calls handleAltFormSubmit when password reset form is submitted', async () => {
    // Simular parámetros en la URL
    window.history.pushState({}, 'Test page', '/login?id=123&auth=1746863376');
    
    const mockHandleAltFormSubmit = jest.fn();
    (useLogin as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: null,
      altForm: { field1: 'newpassword', field2: 'newpassword' },
      setAltForm: jest.fn(),
      handleAltFormSubmit: mockHandleAltFormSubmit
    });
    
    render(<Login />);
    
    // Verificar que se muestra el formulario de cambio de contraseña
    expect(screen.getByText('Cambio de contraseña')).toBeInTheDocument();
    
    // Enviar el formulario
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    
    // Verificar que se llamó a la función handleAltFormSubmit
    expect(mockHandleAltFormSubmit).toHaveBeenCalled();
  });

  test('shows loading state when login is in progress', () => {
    (useLogin as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: true,
      error: null,
      altForm: { field1: '', field2: '' },
      setAltForm: jest.fn(),
      handleAltFormSubmit: jest.fn()
    });
    
    render(<Login />);
    
    // Verificar que el botón muestra el estado de carga
    expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  test('shows error message when login fails', () => {
    (useLogin as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: 'Credenciales inválidas',
      altForm: { field1: '', field2: '' },
      setAltForm: jest.fn(),
      handleAltFormSubmit: jest.fn()
    });
    
    render(<Login />);
    
    // Verificar que se muestra el mensaje de error
    expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
  });
});

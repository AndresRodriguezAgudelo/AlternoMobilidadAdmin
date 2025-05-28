import { useState } from 'react';
import Logo from '../../assets/images/LogoMobilityAZUL.png';
import LoginBackgroundImage from '../../assets/images/LoginBackgroundImage.png';
import { InputText } from '../../components/inputs/inputText';
import { InputPassword } from '../../components/inputs/inputPassword';
import { InputCheckBox } from '../../components/inputs/inputCheckBox';
import { Button } from '../../components/buttons/simpleButton';
import { useLogin } from '../../customHooks/pages/login/customHook';
import { useInputPassword } from '../../customHooks/components/inputPassword/customHook';


import './styled.css';

export default function Login() {
  const { 
    login, 
    loading: loginLoading, 
    error: loginError, 
    altForm, 
    setAltForm,
    handleAltFormSubmit
  } = useLogin();
  
  // Usar el hook useInputPassword para la funcionalidad de olvidé contraseña
  const { handleForgotPassword, loading: resetLoading } = useInputPassword();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, policies: false, field1: false, field2: false });

  // Mensajes de error personalizados
  const emailErrorMsg = touched.email && credentials.email === ''
    ? 'Este campo es obligatorio. Por favor, ingresa el correo'
    : '';
  const passwordErrorMsg = touched.password && credentials.password === ''
    ? 'Este campo es obligatorio. Por favor, ingresa la contraseña'
    : '';
  const policiesErrorMsg = touched.policies && !acceptedPolicies
    ? 'Debes aceptar las políticas de protección de datos para continuar'
    : '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedPolicies) {
      return;
    }
    await login(credentials);
  };

  const handleResetPassword = () => {
    // Simplemente disparar el POST sin solicitar ningún dato
    handleForgotPassword();
  };

  // Obtener parámetros de la URL
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');
  const authParam = params.get('auth');
  

  // Renderizado condicional basado en la presencia de parámetros URL
  return idParam && authParam ? (
    // Formulario alternativo cuando hay parámetros id y auth
    <div className="login-container">
      <div className="login-image-container">
        <div className="login-image-wrapper">
          <img
            src={LoginBackgroundImage}
            alt="Login Background"
            className="login-background-image"
          />
        </div>
      </div>

      <div className="login-form-container">
        <div className="login-form-content">
          <img
            src={Logo}
            alt="Logo"
            className="login-logo"
          />

          <h1 className="login-title">Cambio de contraseña</h1>

          <form onSubmit={handleAltFormSubmit} className="login-form">

          <InputPassword
              label="Nueva contraseña"
              value={altForm.field1}
              onChange={(value) => {
                setAltForm(prev => ({ ...prev, field1: value }));
                setTouched(prev => ({ ...prev, field1: true }));
              }}
              placeholder="Ingresa tu nueva contraseña"
              resetPass={false} // No mostrar opción de olvidé contraseña
              error={touched.field1 && !altForm.field1}
              errorMessage={touched.field1 && !altForm.field1 ? 'Este campo es obligatorio. Por favor, ingresa la contraseña' : ''}
            />

            <InputPassword
              label="Confirmar contraseña"
              value={altForm.field2}
              onChange={(value) => {
                setAltForm(prev => ({ ...prev, field2: value }));
                setTouched(prev => ({ ...prev, field2: true }));
              }}
              placeholder="Confirma tu nueva contraseña"
              resetPass={false}
              error={(touched.field2 && !altForm.field2) || (altForm.field1 !== altForm.field2 && altForm.field2 !== '')}
              errorMessage={touched.field2 && !altForm.field2 
                ? 'Este campo es obligatorio. Por favor, confirma la contraseña' 
                : (altForm.field1 !== altForm.field2 && altForm.field2 !== '') 
                  ? "Las contraseñas no coinciden" 
                  : ""}
            />

            {loginError && <div className="login-error">
              <span className="input-text-error-icon">⚠ </span>
              {loginError}
            </div>}
            <div className='spacer-reset-password'></div>
            <Button
              type="submit"
              label={loginLoading ? 'Restableciendo contraseña...' : 'Cambiar contraseña'}
              disabled={loginLoading || !altForm.field1 || !altForm.field2 || altForm.field1 !== altForm.field2}
            />
          </form>
        </div>
      </div>
    </div>
  ) : (
    // Formulario de login normal
    <div className="login-container">
      <div className="login-image-container">
        <div className="login-image-wrapper">
          <img
            src={LoginBackgroundImage}
            alt="Login Background"
            className="login-background-image"
          />
        </div>
      </div>

      <div className="login-form-container">
        <div className="login-form-content">
          <img
            src={Logo}
            alt="Logo"
            className="login-logo"
          />

          <h1 className="login-title">Portal de administración</h1>

          <form onSubmit={handleLogin} className="login-form">
            <InputText
              label="Correo electrónico"
              value={credentials.email}
              onChange={(value) => {
                setCredentials(prev => ({ ...prev, email: value }));
                setTouched(prev => ({ ...prev, email: true }));
              }}
              placeholder="ejemplo@correo.com"
              validation="mail"
              error={!!emailErrorMsg}
              errorMessage={emailErrorMsg}
            />

            <InputPassword
              label="Contraseña"
              value={credentials.password}
              onChange={(value) => {
                setCredentials(prev => ({ ...prev, password: value }));
                setTouched(prev => ({ ...prev, password: true }));
              }}
              placeholder="Ingresa tu contraseña"
              resetPass={true}
              onResetClick={() => handleResetPassword()}
              error={!!passwordErrorMsg}
              errorMessage={passwordErrorMsg}
            />

            {loginError && <div className="login-error">
              <span className="input-text-error-icon">⚠ </span>
              {loginError}

            </div>}

            <div className="login-options">
              <InputCheckBox
                label=""
                checked={acceptedPolicies}
                onChange={(checked) => {
                  setAcceptedPolicies(checked);
                  setTouched(prev => ({ ...prev, policies: true }));
                }}
              />
              <span className="forgot-password">
                He leído y acepto las
                <a href="https://www.equirent.com.co/home/blog/2024/01/20/politicas-sistema-integral-de-proteccion-de-datos-personales-pdp" className='forgot-password-link'> políticas de protección de <br /> datos personales y seguridad de la información</a>
              </span>
            </div>
            {policiesErrorMsg && (
              <div className="input-text-error-container">
                <span className="input-text-error-icon">⚠</span>
                <span className="input-text-error-message">{policiesErrorMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              label={loginLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              disabled={loginLoading || resetLoading || !credentials.email || !credentials.password || !acceptedPolicies}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

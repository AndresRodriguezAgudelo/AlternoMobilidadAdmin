import { useState } from 'react';
import LoginBackground from '../../assets/images/LoginBackground.png';
import Logo from '../../assets/images/LogoMobilityAZUL.png';
import { InputText } from '../../components/inputs/inputText';
import { InputPassword } from '../../components/inputs/inputPassword';
import { InputCheckBox } from '../../components/inputs/inputCheckBox';
import { Button } from '../../components/buttons/simpleButton';
import { useLogin } from '../../customHooks/pages/login/customHook';
import './styled.css';

export default function Login() {
  const { login, loading, error } = useLogin();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, policies: false });

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
    console.log('futuro reset de password')
  };

  return (
    <div className="login-container">
      <div className="login-image-container">
        <div className="login-image-wrapper">
          <img 
            src={LoginBackground} 
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
            
            {error && <div className="login-error"> 
              <span className="input-text-error-icon">⚠ </span>
              {error}
              
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
                <a href="#" className='forgot-password-link'> políticas de protección de <br/> datos personales y seguridad de la información</a>
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
              label={loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              disabled={loading || !credentials.email || !credentials.password || !acceptedPolicies}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

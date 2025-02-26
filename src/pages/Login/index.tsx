import { useState, useEffect } from 'react';
import LoginBackground from '../../assets/images/LoginBackground.png';
import Logo from '../../assets/images/logoTopBar.png';
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
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setCredentials(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem('email', credentials.email);
    } else {
      localStorage.removeItem('email');
    }
    await login(credentials);
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
              onChange={(value) => setCredentials(prev => ({ ...prev, email: value }))}
              placeholder="ejemplo@correo.com"
              validation="mail"
              error={error ? true : false}
            />
            
            <InputPassword
              label="Contraseña"
              value={credentials.password}
              onChange={(value) => setCredentials(prev => ({ ...prev, password: value }))}
              placeholder="Ingresa tu contraseña"
              error={error ? true : false}
            />
            
            {error && <div className="login-error">{error}</div>}
            
            <div className="login-options">
              <InputCheckBox
                label="Recordarme"
                checked={rememberMe}
                onChange={setRememberMe}
              />
              <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            
            <Button
              type="submit"
              label={loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              disabled={loading || !credentials.email || !credentials.password}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

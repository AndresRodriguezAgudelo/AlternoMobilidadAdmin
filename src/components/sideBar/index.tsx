import { useNavigate, useLocation } from 'react-router-dom';
import { 
  PermIdentity,
  DirectionsCarFilledOutlined,
  ConstructionOutlined,
  MapOutlined,
  CreditCardOutlined,
  Logout 
} from '@mui/icons-material';
import { OptionCard } from './optionCard';
import EQlogo from '../../assets/images/EQBlanco.png';
import './styled.css';

// Definimos los items del menú
const menuItems = [
  { icon: PermIdentity, label: 'Usuarios', path: '/' },
  { icon: DirectionsCarFilledOutlined, label: 'Consultas', path: '/consultas' },
  { icon: ConstructionOutlined, label: 'Servicios', path: '/services' },
  { icon: MapOutlined, label: 'Guias', path: '/guias' },
  { icon: CreditCardOutlined, label: 'Pagos', path: '/pagos' },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={EQlogo} alt="Equirent Logo" className="logo-image" />
        </div>
        <h2 className="portal-title">Portal Administrativo</h2>
        
        <span className="admin-label">Administrador</span>

      </div>

      <div className="navigation-options">
        {menuItems.map((item) => (
          <OptionCard
            key={item.path}
            icon={item.icon}
            label={item.label}
            onClick={() => navigate(item.path)}
            isActive={location.pathname === item.path}
          />
        ))}
      </div>

        <div 
          className="logout-section"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          <Logout className="logout-icon" />
          <span className="logout-label">Cerrar Sesión</span>
        </div>

    </nav>
  );
};

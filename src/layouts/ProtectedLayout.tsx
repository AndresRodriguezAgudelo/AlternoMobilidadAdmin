import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/sideBar';
import { PageTransition } from '../components/pageTransition';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import './ProtectedLayout.css';

const ProtectedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Verifica si hay token (puedes ajustar el nombre de la clave si es diferente)
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  if (checkingAuth) {
    // Loader centrado (puedes personalizar el estilo o reemplazar por un spinner de tu preferencia)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-content">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ProtectedLayout;

import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/sideBar';
import { PageTransition } from '../components/pageTransition';
import { AnimatePresence } from 'framer-motion';
import './ProtectedLayout.css';

const ProtectedLayout = () => {
  const location = useLocation();

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

import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedLayout from '../layouts/ProtectedLayout';
import Login from '../pages/Login';
import Users from '../pages/Users';
import Queries from '../pages/Queries';
import Services from '../pages/Services';
import {ServiceEditor} from '../pages/Services/serviceEditor';
import {GuidesEditor} from '../pages/Guides/guidesEditor';
import Guides from '../pages/Guides';
import Payments from '../pages/Payments';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: <Users />,
      },
      {
        path: '/consultas',
        element: <Queries />,
      },
      {
        path: '/services',
        element: <Services />,
      },
      {
        path: '/services/serviceEditor',
        element: <ServiceEditor />,
      },
      {
        path: '/services/serviceEditor/:id',
        element: <ServiceEditor />,
      },
      {
        path: '/guias',
        element: <Guides />,
      },
      {
        path: '/guias/guiasEditor',
        element: <GuidesEditor />,
      },
      {
        path: '/guias/guiasEditor/:id',
        element: <GuidesEditor />,
      },
      {
        path: '/pagos',
        element: <Payments />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

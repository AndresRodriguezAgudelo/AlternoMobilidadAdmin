import React from 'react';

// Polyfill para TextEncoder y TextDecoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

import { router } from '../src/router';

// Mock de los componentes utilizados en las rutas
jest.mock('../src/layouts/ProtectedLayout', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'protected-layout' }, 'Protected Layout')
}));

jest.mock('../src/pages/Login', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'login-page' }, 'Login Page')
}));

jest.mock('../src/pages/Users', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'users-page' }, 'Users Page')
}));

jest.mock('../src/pages/Queries', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'queries-page' }, 'Queries Page')
}));

jest.mock('../src/pages/Services', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'services-page' }, 'Services Page')
}));

jest.mock('../src/pages/Services/serviceEditor', () => ({
  ServiceEditor: () => React.createElement('div', { 'data-testid': 'service-editor-page' }, 'Service Editor Page')
}));

jest.mock('../src/pages/Guides', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'guides-page' }, 'Guides Page')
}));

jest.mock('../src/pages/Guides/guidesEditor', () => ({
  GuidesEditor: () => React.createElement('div', { 'data-testid': 'guides-editor-page' }, 'Guides Editor Page')
}));

jest.mock('../src/pages/Payments', () => ({
  __esModule: true,
  default: () => React.createElement('div', { 'data-testid': 'payments-page' }, 'Payments Page')
}));

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    Navigate: ({ to }: { to: string }) => React.createElement('div', { 'data-testid': 'navigate', 'data-to': to }, 'Navigate')
  };
});

describe('Router Configuration', () => {
  test('debería tener la ruta de login configurada correctamente', () => {
    const loginRoute = router.routes.find(route => route.path === '/login');
    expect(loginRoute).toBeDefined();
  });

  test('debería tener la ruta principal configurada correctamente', () => {
    const mainRoute = router.routes.find(route => route.path === '/');
    expect(mainRoute).toBeDefined();
    if (mainRoute) {
      expect(mainRoute.children).toBeDefined();
      if (mainRoute.children) {
        expect(mainRoute.children.length).toBeGreaterThan(0);
      }
    }
  });

  test('debería tener todas las rutas secundarias configuradas', () => {
    const mainRoute = router.routes.find(route => route.path === '/');
    expect(mainRoute).toBeDefined();
    
    if (mainRoute && mainRoute.children) {
      const childRoutes = mainRoute.children;
      
      // Verificar rutas específicas
      const paths = childRoutes.map(route => route.path);
      
      expect(paths).toContain('/');
      expect(paths).toContain('/consultas');
      expect(paths).toContain('/services');
      expect(paths).toContain('/services/serviceEditor');
      expect(paths).toContain('/services/serviceEditor/:id');
      expect(paths).toContain('/guias');
      expect(paths).toContain('/guias/guiasEditor');
      expect(paths).toContain('/guias/guiasEditor/:id');
      expect(paths).toContain('/pagos');
    }
  });

  test('debería tener una ruta comodín para redireccionar rutas no encontradas', () => {
    const fallbackRoute = router.routes.find(route => route.path === '*');
    expect(fallbackRoute).toBeDefined();
  });
});

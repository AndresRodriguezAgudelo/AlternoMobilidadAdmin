import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock de los módulos necesarios
jest.mock('@mui/icons-material', () => {
  const MockIcon = () => <div data-testid="mock-icon">Icon</div>;
  MockIcon.muiName = 'SvgIcon';
  return {
    SvgIconComponent: MockIcon,
    Search: MockIcon
  };
});

// Importar después del mock para que use los mocks
import { IconButton } from '../src/components/buttons/iconButton';
import { Search } from '@mui/icons-material';

describe('IconButton Component', () => {
  // Test básico para comprobar que el componente se renderiza
  test('renders the component', () => {
    // Renderizar el componente con las props mínimas necesarias
    const { container } = render(
      <IconButton 
        Icon={Search} 
        onClick={() => {}} 
      />
    );
    
    // Verificar que el componente se renderiza
    expect(container.firstChild).toBeInTheDocument();
  });
});


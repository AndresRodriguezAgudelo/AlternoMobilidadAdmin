import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Icon } from '../src/components/icon';
import { SvgIconProps } from '@mui/material';

// Creamos un componente de ícono de prueba
const TestIcon = (props: SvgIconProps) => (
  <svg 
    data-testid="test-svg-icon" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    {...props}
  >
    <path d="M12 2L2 12h3v8h14v-8h3L12 2z" />
  </svg>
);

describe('Icon Component', () => {
  test('debería renderizar el ícono proporcionado', () => {
    const { getByTestId } = render(<Icon icon={TestIcon} />);
    expect(getByTestId('test-svg-icon')).toBeInTheDocument();
  });

  test('debería pasar las props adicionales al ícono', () => {
    const { getByTestId } = render(
      <Icon 
        icon={TestIcon} 
        data-testid="test-svg-icon"
        color="primary"
        fontSize="large"
      />
    );
    
    const iconElement = getByTestId('test-svg-icon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute('color', 'primary');
    expect(iconElement).toHaveAttribute('font-size', 'large');
  });
});

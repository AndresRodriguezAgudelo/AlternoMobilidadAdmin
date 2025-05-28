import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Loading } from '../src/components/loading';

describe('Loading Component', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<Loading />);
    
    // Verificar que el contenedor tiene la clase correcta para el tamaño medio por defecto
    const loadingContainer = container.querySelector('.loading-container');
    expect(loadingContainer).toHaveClass('medium');
    
    // Verificar que los spinners están presentes
    const spinners = container.querySelectorAll('.loading-spinner');
    expect(spinners).toHaveLength(2);
    
    // Verificar que el segundo spinner tiene la clase 'inner'
    expect(spinners[1]).toHaveClass('inner');
    
    // Verificar que los spinners tienen el color por defecto
    expect(spinners[0]).toHaveStyle({ borderColor: 'var(--blue-500)' });
    expect(spinners[1]).toHaveStyle({ borderColor: 'var(--blue-500)' });
  });

  it('renders correctly with small size', () => {
    const { container } = render(<Loading size="small" />);
    
    // Verificar que el contenedor tiene la clase correcta para el tamaño pequeño
    const loadingContainer = container.querySelector('.loading-container');
    expect(loadingContainer).toHaveClass('small');
    expect(loadingContainer).not.toHaveClass('medium');
    expect(loadingContainer).not.toHaveClass('large');
  });

  it('renders correctly with large size', () => {
    const { container } = render(<Loading size="large" />);
    
    // Verificar que el contenedor tiene la clase correcta para el tamaño grande
    const loadingContainer = container.querySelector('.loading-container');
    expect(loadingContainer).toHaveClass('large');
    expect(loadingContainer).not.toHaveClass('medium');
    expect(loadingContainer).not.toHaveClass('small');
  });

  it('renders correctly with custom color', () => {
    const customColor = '#FF0000';
    const { container } = render(<Loading color={customColor} />);
    
    // Verificar que los spinners tienen el color personalizado
    const spinners = container.querySelectorAll('.loading-spinner');
    expect(spinners[0]).toHaveStyle({ borderColor: customColor });
    expect(spinners[1]).toHaveStyle({ borderColor: customColor });
  });

  it('applies both custom size and color', () => {
    const customColor = '#00FF00';
    const { container } = render(<Loading size="small" color={customColor} />);
    
    // Verificar que el contenedor tiene la clase correcta para el tamaño pequeño
    const loadingContainer = container.querySelector('.loading-container');
    expect(loadingContainer).toHaveClass('small');
    
    // Verificar que los spinners tienen el color personalizado
    const spinners = container.querySelectorAll('.loading-spinner');
    expect(spinners[0]).toHaveStyle({ borderColor: customColor });
    expect(spinners[1]).toHaveStyle({ borderColor: customColor });
  });
});

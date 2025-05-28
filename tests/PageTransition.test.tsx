import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageTransition } from '../src/components/pageTransition';

// Mock para framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, variants }) => (
      <div 
        data-testid="motion-div"
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        data-exit={JSON.stringify(exit)}
        data-variants={JSON.stringify(variants)}
      >
        {children}
      </div>
    )
  }
}));

describe('PageTransition Component', () => {
  it('renders children correctly', () => {
    const testContent = <div data-testid="test-content">Test Content</div>;
    const { getByTestId } = render(
      <PageTransition>
        {testContent}
      </PageTransition>
    );
    
    // Verificar que el contenido hijo se renderiza correctamente
    const content = getByTestId('test-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Test Content');
    
    // Verificar que el div de motion está presente
    const motionDiv = getByTestId('motion-div');
    expect(motionDiv).toBeInTheDocument();
    expect(motionDiv).toContainElement(content);
  });

  it('passes correct animation props to motion.div', () => {
    const { getByTestId } = render(
      <PageTransition>
        <div>Test</div>
      </PageTransition>
    );
    
    const motionDiv = getByTestId('motion-div');
    
    // Verificar que se pasan las propiedades de animación correctas
    expect(motionDiv).toHaveAttribute('data-initial', '"initial"');
    expect(motionDiv).toHaveAttribute('data-animate', '"enter"');
    expect(motionDiv).toHaveAttribute('data-exit', '"exit"');
    
    // Verificar que se pasan las variantes de animación
    const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
    expect(variants).toHaveProperty('initial');
    expect(variants).toHaveProperty('enter');
    expect(variants).toHaveProperty('exit');
    
    // Verificar las propiedades específicas de las variantes
    expect(variants.initial).toHaveProperty('opacity', 0);
    expect(variants.initial).toHaveProperty('x', 1000);
    
    expect(variants.enter).toHaveProperty('opacity', 1);
    expect(variants.enter).toHaveProperty('x', 0);
    expect(variants.enter.transition).toHaveProperty('duration', 0.3);
    
    expect(variants.exit).toHaveProperty('opacity', 0);
    expect(variants.exit.transition).toHaveProperty('duration', 0.2);
    expect(variants.exit.transition).toHaveProperty('ease', 'easeOut');
  });

  it('renders multiple children correctly', () => {
    const { getByText } = render(
      <PageTransition>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </PageTransition>
    );
    
    // Verificar que todos los hijos se renderizan correctamente
    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
    expect(getByText('Child 3')).toBeInTheDocument();
  });
});

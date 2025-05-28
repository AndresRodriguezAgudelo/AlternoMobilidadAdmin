import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OptionCard } from '../src/components/sideBar/optionCard';
import { Home } from '@mui/icons-material';

// Mock del componente Icon para evitar problemas con SVG en los tests
jest.mock('../src/components/icon', () => ({
  Icon: ({ icon: IconComponent, ...props }) => {
    return <IconComponent data-testid="mocked-icon" {...props} />;
  }
}));

describe('OptionCard Component', () => {
  test('debería renderizar con las props correctas', () => {
    render(<OptionCard icon={Home} label="Inicio" />);
    
    // Verificar que el ícono y la etiqueta se rendericen
    expect(screen.getByTestId('mocked-icon')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Inicio').className).toBe('option-label');
  });

  test('debería aplicar la clase active cuando isActive es true', () => {
    const { container } = render(<OptionCard icon={Home} label="Inicio" isActive={true} />);
    
    // Verificar que la clase active esté presente
    const optionCard = container.querySelector('.option-card');
    expect(optionCard).toHaveClass('active');
  });

  test('no debería aplicar la clase active cuando isActive es false', () => {
    const { container } = render(<OptionCard icon={Home} label="Inicio" isActive={false} />);
    
    // Verificar que la clase active no esté presente
    const optionCard = container.querySelector('.option-card');
    expect(optionCard).not.toHaveClass('active');
  });

  test('debería llamar a onClick cuando se hace clic', () => {
    const handleClick = jest.fn();
    render(<OptionCard icon={Home} label="Inicio" onClick={handleClick} />);
    
    // Simular clic en el componente
    const optionCard = screen.getByText('Inicio').closest('.option-card');
    if (optionCard) {
      fireEvent.click(optionCard);
    } else {
      throw new Error('No se encontró el elemento option-card');
    }
    
    // Verificar que se llamó al manejador de eventos
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('debería renderizar el ícono de flecha', () => {
    render(<OptionCard icon={Home} label="Inicio" />);
    
    // Verificar que el ícono de flecha esté presente
    const arrowIcon = document.querySelector('.arrow-icon');
    expect(arrowIcon).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/buttons/simpleButton';

describe('Button Component', () => {
  test('renders with label', () => {
    render(<Button label="Test Button" />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button label="Disabled Button" disabled={true} />);
    
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled');
  });

  test('applies custom className', () => {
    render(<Button label="Custom Button" className="custom-class" />);
    
    const button = screen.getByText('Custom Button');
    expect(button).toHaveClass('custom-class');
  });

  test('has correct button type', () => {
    render(<Button label="Submit Button" type="submit" />);
    
    const button = screen.getByText('Submit Button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  test('has default button type when not specified', () => {
    render(<Button label="Default Button" />);
    
    const button = screen.getByText('Default Button');
    expect(button).toHaveAttribute('type', 'button');
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SwitchInput } from '../src/components/inputs/inputSwitch';

describe('SwitchInput Component', () => {
  test('renders correctly when inactive', () => {
    render(<SwitchInput value={false} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
    expect(switchElement).not.toHaveClass('active');
  });

  test('renders correctly when active', () => {
    render(<SwitchInput value={true} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
    expect(switchElement).toHaveClass('active');
  });

  test('calls onChange with correct value when clicked and inactive', () => {
    const handleChange = jest.fn();
    
    render(<SwitchInput value={false} onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test('calls onChange with correct value when clicked and active', () => {
    const handleChange = jest.fn();
    
    render(<SwitchInput value={true} onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  test('does not call onChange when disabled', () => {
    const handleChange = jest.fn();
    
    render(<SwitchInput value={false} onChange={handleChange} disabled={true} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('has disabled class when disabled', () => {
    render(<SwitchInput value={false} disabled={true} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('disabled');
  });

  test('has correct tabIndex when enabled', () => {
    render(<SwitchInput value={false} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('tabIndex', '0');
  });

  test('has correct tabIndex when disabled', () => {
    render(<SwitchInput value={false} disabled={true} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('tabIndex', '-1');
  });

  test('contains the switch ball element', () => {
    render(<SwitchInput value={false} />);
    
    const switchElement = screen.getByRole('switch');
    const ballElement = switchElement.querySelector('.switch-ball');
    expect(ballElement).toBeInTheDocument();
  });
});

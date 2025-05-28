import './styled.css';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export const Button = ({ label, onClick, type = 'button', disabled = false, className = '' }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`custom-button ${disabled ? 'disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

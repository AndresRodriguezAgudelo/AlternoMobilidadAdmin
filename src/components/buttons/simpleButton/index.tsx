import './styled.css';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button = ({ label, onClick, type = 'button', disabled = false }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`custom-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

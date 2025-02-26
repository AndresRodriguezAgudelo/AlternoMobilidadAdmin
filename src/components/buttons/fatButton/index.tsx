import './styled.css';

interface FatButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const FatButton = ({ label, onClick, type = 'button', disabled = false }: FatButtonProps) => {
  return (
    <button
      type={type}
      className={`fatbButton ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

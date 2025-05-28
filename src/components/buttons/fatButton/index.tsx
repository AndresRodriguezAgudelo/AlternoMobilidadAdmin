import './styled.css';
import { SvgIconComponent } from '@mui/icons-material';

interface FatButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'default' | 'danger';
  backgroundColor?: string;
  textColor?: string;
  Icon?: SvgIconComponent;
}

export const FatButton = ({ 
  label, 
  onClick, 
  type = 'button', 
  disabled = false, 
  variant = 'default',
  backgroundColor,
  textColor,
  Icon
}: FatButtonProps) => {
  const buttonStyle = {
    backgroundColor: backgroundColor,
    color: textColor
  };

  return (
    <button
      type={type}
      className={`fatbButton ${disabled ? 'disabled' : ''} ${variant}`}
      onClick={onClick}
      disabled={disabled}
      style={backgroundColor || textColor ? buttonStyle : undefined}
    >
      <span className="fatbButton-label">{label}</span>
      {Icon && <Icon className="fatbButton-icon" />}
    </button>
  );
};

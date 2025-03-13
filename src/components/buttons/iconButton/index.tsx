import { SvgIconComponent } from '@mui/icons-material';
import './styled.css';

interface IconButtonProps {
  Icon: SvgIconComponent;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  backgroundColor?: string;
  color?: string;
  loading?: boolean;
}

export const IconButton = ({ 
  Icon, 
  onClick, 
  type = 'button', 
  title, 
  backgroundColor, 
  color,
  loading = false 
}: IconButtonProps) => {
  return (
    <button
      type={type}
      className={`icon-button ${loading ? 'loading' : ''}`}
      onClick={onClick}
      title={title}
      style={{
        backgroundColor: backgroundColor,
        color: color
      }}
      disabled={loading}
    >
      <Icon />
    </button>
  );
};

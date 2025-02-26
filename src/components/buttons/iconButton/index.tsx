import { SvgIconComponent } from '@mui/icons-material';
import './styled.css';

interface IconButtonProps {
  Icon: SvgIconComponent;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  backgroundColor?: string;
  color?: string;
}

export const IconButton = ({ Icon, onClick, type = 'button', title, backgroundColor, color }: IconButtonProps) => {
  return (
    <button
      type={type}
      className="icon-button"
      onClick={onClick}
      title={title}
      style={{
        backgroundColor: backgroundColor,
        color: color
      }}
    >
      <Icon />
    </button>
  );
};

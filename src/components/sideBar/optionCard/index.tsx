import { ArrowForwardIos } from '@mui/icons-material';
import { Icon } from '../../icon';
import './styled.css';

interface OptionCardProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const OptionCard = ({ icon, label, onClick, isActive = false }: OptionCardProps) => {
  return (
    <div className={`option-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="option-card-content">
        <div className="icon-container">
          <Icon icon={icon} />
        </div>
        <span className="option-label">{label}</span>
      </div>
      <ArrowForwardIos className="arrow-icon" />
    </div>
  );
};

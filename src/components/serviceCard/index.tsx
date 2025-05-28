import { DragIndicator, ModeEditOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { IconButton } from '../buttons/iconButton';
import imageTest from '../../assets/images/imageService.png';
import './styled.css';

interface ServiceCardProps {
  id: number;
  image: string;
  description: string;
  link?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  isHighlighted?: boolean;
}

const defaultHandleEdit = () => console.log('Edit action - to be implemented');
const defaultHandleDelete = () => console.log('Delete action - to be implemented');
const defaultHandleDragStart = () => console.log('Drag start - to be implemented');

export const ServiceCard = ({
  id,
  image,
  description,
  link,
  onEdit = defaultHandleEdit,
  onDelete = defaultHandleDelete,
  onDragStart = defaultHandleDragStart,
  isHighlighted = false
}: ServiceCardProps) => {
  return (
    <div 
      className="service-card-container" 
      draggable 
      onDragStart={onDragStart}
    >

      
      <div className="service-id-container">
        <span className="service-id">{id}</span>
      </div>

      <div className={`service-content ${isHighlighted ? 'highlight' : ''}`}>

        <div className="service-info">
          <img
            src={image}
            alt={`Servicio ${id}`}
            className="service-image"
            style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
            onError={e => {
              const target = e.target as HTMLImageElement;
              if (target.src !== imageTest) target.src = imageTest;
            }}
          />
          <div className="service-text">
            <p className="service-description">{description}</p>
            {link && <a href={link} target="_blank" rel="noopener noreferrer" className="service-link">{link}</a>}
          </div>
        </div>
        <div className="service-actions">
          <IconButton
            backgroundColor='#e8f7fc'
            color='black'
            Icon={ModeEditOutlined}
            onClick={onEdit}
          />
          <IconButton
            backgroundColor='#e8f7fc'
            color='red'
            Icon={DeleteOutlineOutlined}
            onClick={onDelete}
          />
        </div>

      </div>



      <div className="service-drag-handle">
        <DragIndicator />
      </div>
    </div>
  );
};

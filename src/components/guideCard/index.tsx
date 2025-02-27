import { Edit, Delete } from '@mui/icons-material';
import { IconButton } from '../buttons/iconButton';
import './styled.css';

interface GuideCardProps {
  imageUrl: string;
  title: string;
  category: string;
  date: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const GuideCard = ({
  imageUrl,
  title,
  category,
  date,
  onEdit,
  onDelete
}: GuideCardProps) => {
  // Funciones por defecto
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="guide-card">
      <div className="guide-image">
        <img src={imageUrl} alt={title} />
      </div>
      
      <div className="guide-info">
        <h3 className="guide-title">{title}</h3>
        <div className="guide-category">
          <span>{category}</span>
        </div>
      </div>
      
      <div className="guide-actions">
        <span className="guide-date">{date}</span>
        <div className="guide-buttons">
          <IconButton
            Icon={Edit}
            onClick={handleEdit}
            backgroundColor="transparent"
          />
          <IconButton
            Icon={Delete}
            onClick={handleDelete}
            backgroundColor="transparent"
          />
        </div>
      </div>
    </div>
  );
};

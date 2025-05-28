import { Edit, Delete } from '@mui/icons-material';
import { IconButton } from '../buttons/iconButton';
import './styled.css';
import imageService from '../../assets/images/imageService.png';

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

  // Si imageUrl es vacío, null, undefined o falsy, usar imagen por defecto
  const displayImage = imageUrl ? imageUrl : imageService;

  return (
    <div className="guide-card">
      <div className="guide-image">
        <img
          src={displayImage}
          alt={title}
          style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', background: '#f5f5f5' }}
          onError={e => {
            const target = e.target as HTMLImageElement;
            // Solo reemplaza si aún no es la imagen por defecto
            if (!target.src.includes('imageService.png')) {
              console.warn('[GuideCard] Imagen no encontrada, usando fallback:', target.src);
              target.src = imageService;
            }
          }}
        />
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
            backgroundColor="#e8f7fc"
            color="black"
            Icon={Edit}
            onClick={handleEdit}
          />
          <IconButton
            backgroundColor="#e8f7fc"
            color="red"
            Icon={Delete}
            onClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

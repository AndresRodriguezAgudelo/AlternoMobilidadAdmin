import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { IconButton } from '../buttons/iconButton';
import './styled.css';

interface GuideCardProps {
  imageUrl: string;
  title: string;
  description?: string;
  category: string;
  date: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const GuideCard = ({
  imageUrl,
  title,
  description,
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

  // Usar la URL de imagen proporcionada sin fallback automático
  // Esto permite que el componente InputFile maneje sus propias imágenes por defecto
  const displayImage = imageUrl;

  return (
    <div className="guide-card">
      <div className="guide-image">
        <img
          src={displayImage}
          alt={title}
          style={{ width: '100%', maxHeight: '250px', borderRadius: '10px', background: '#f5f5f5' }}
          // Eliminamos el manejo de errores para que no interfiera con InputFile
          // Si hay algún problema con la imagen, InputFile ya debería haberlo manejado
        />
      </div>
      
      <div className="guide-info">
        <h3 className="guide-title">{title}</h3>
        {description && <p className="guide-description">{description}</p>}
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
            Icon={EditOutlined}
            onClick={handleEdit}
          />
          <IconButton
            backgroundColor="#e8f7fc"
            color="red"
            Icon={DeleteOutline}
            onClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

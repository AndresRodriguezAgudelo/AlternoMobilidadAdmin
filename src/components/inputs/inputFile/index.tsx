import { useState, useRef } from 'react';

const isVideo = (url: string) => {
  return url.startsWith('data:video/') || url.match(/\.(mp4|mov)$/i);
};
import { Upload, DeleteOutline } from '@mui/icons-material';
import { IconButton } from '../../buttons/iconButton';
import './styled.css';

interface InputFileProps {
  label: string;
  onChange: (file: File | null) => void;
  value?: string;
  accept?: 'image' | 'video' | 'both';
  maxSize?: number; // en MB
}

export const InputFile = ({ 
  label, 
  onChange, 
  value, 
  accept = 'image',
  maxSize = 5 // 5MB por defecto
}: InputFileProps) => {
  const [preview, setPreview] = useState<string | undefined>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDelete = () => {
    setPreview(undefined);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="input-image-container">
      <label className="input-image-label">{label}</label>
      <div className="input-image-wrapper">
        <div 
          className="input-image-preview" 
          onClick={handleClick}
        >
        {preview ? (
          isVideo(preview) ? (
            <video 
              src={preview} 
              controls 
              className="preview-video"
            />
          ) : (
            <img src={preview} alt="Preview" className="preview-image" />
          )
        ) : (
          <div className="upload-placeholder">
            <div className="file-types">
              <Upload style={{ fontSize: 34 }} />
              <span>Subir {accept === 'video' ? 'video' : accept === 'image' ? 'imagen' : 'archivo'}</span>
            </div>
            <span>
              {accept === 'video' ? 
                `Formatos aceptados: MP4 y MOV. Tamaño máximo: ${maxSize}MB` :
                accept === 'image' ? 
                `Las medidas recomendadas para la imagen son 300[ancho] x 240[alto] píxeles. Formatos: JPG y PNG. Tamaño máximo: ${maxSize}MB` :
                `Formatos aceptados: JPG, PNG, MP4 y MOV. Tamaño máximo: ${maxSize}MB`
              }
            </span>
          </div>
        )}
        </div>
        {preview && (
          <div className="delete-image-button" onClick={e => e.stopPropagation()}>
            <IconButton 
              Icon={DeleteOutline}
              onClick={handleDelete}
              title="Eliminar imagen"
              backgroundColor="white"
              color="var(--gray-400)"
            />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept === 'image' ? 'image/jpeg,image/png' : 
                accept === 'video' ? 'video/mp4,video/quicktime' : 
                'image/jpeg,image/png,video/mp4,video/quicktime'}
        onChange={handleChange}
        className="input-image-file"
      />
    </div>
  );
};

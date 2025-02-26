import { useState, useRef } from 'react';
import { Upload, DeleteOutline } from '@mui/icons-material';
import { IconButton } from '../../buttons/iconButton';
import './styled.css';

interface InputImageProps {
  label: string;
  onChange: (file: File | null) => void;
  value?: string;
}

export const InputImage = ({ label, onChange, value }: InputImageProps) => {
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
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <div className="upload-placeholder">
            <div className="file-types">
              <Upload style={{ fontSize: 34 }} />
              <span>Subir archivo</span>
            </div>
            <span>Las medidas recomendadas para la imagen son 300[ancho] x 240[alto] píxeles. Los formatos aceptados son: JPG y PNG.</span>
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
        accept="image/jpeg,image/png"
        onChange={handleChange}
        className="input-image-file"
      />
    </div>
  );
};

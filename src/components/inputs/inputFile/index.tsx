// Importa los hooks de React necesarios
import { useState, useRef, useEffect } from 'react';

// Función auxiliar para determinar si una URL es de video
const isVideo = (url: string) => {
  return url.startsWith('data:video/') || url.match(/\.(mp4|mov)$/i);
};

// Importa íconos y componentes de UI
import { Upload, DeleteOutline } from '@mui/icons-material';
import { IconButton } from '../../buttons/iconButton';
import './styled.css';

// Define las props que acepta el componente InputFile
interface InputFileProps {
  label: string; // Texto del label del input
  onChange: (file: File | null) => void; // Callback cuando cambia el archivo
  value?: string; // Valor inicial (para preview)
  accept?: 'image' | 'video' | 'both'; // Tipos aceptados
  maxSize?: number; // Tamaño máximo en MB
  placeholderImage?: string; // Imagen previa (si existe)
}

// Componente principal InputFile
export const InputFile = ({ 
  label, // Label a mostrar arriba del input
  onChange, // Función a ejecutar cuando cambia el archivo
  value, // Valor inicial para preview
  accept = 'image', // Por defecto solo imágenes
  maxSize = 5, // Tamaño máximo por defecto 5MB
  placeholderImage // Imagen previa (si existe)
}: InputFileProps) => {
  // Estado para almacenar la preview del archivo seleccionado
  const [preview, setPreview] = useState<string | undefined>(value);
  // Referencia al input file oculto
  const inputRef = useRef<HTMLInputElement>(null);
  // Estado para saber si la imagen previa realmente existe en el servidor
  const [imageExists, setImageExists] = useState<boolean>(false);
  // Estado para saber si la imagen previa fue eliminada
  const [prevImageDeleted, setPrevImageDeleted] = useState<boolean>(false);

  // Hook para validar si la imagen previa existe en el servidor
  useEffect(() => {
    let ignore = false; // Para evitar race conditions si el componente se desmonta
    // Si hay imagen previa y no es la imagen por defecto
    if (placeholderImage && !/imageService\.png([?#].*)?$/.test(placeholderImage)) {
      // Realiza un HEAD request para saber si la imagen existe
      fetch(placeholderImage, { method: 'HEAD' })
        .then(res => {
          if (!ignore) setImageExists(res.ok); // Si existe, actualiza el estado
        })
        .catch(() => {
          if (!ignore) setImageExists(false); // Si falla, asume que no existe
        });
    } else {
      setImageExists(false); // Si no hay imagen previa o es la default, no existe
    }
    // Cleanup para evitar actualizar estado si el componente se desmonta
    return () => { ignore = true; };
  }, [placeholderImage]);

  // Al hacer click en el área de carga, abre el input file oculto
  const handleClick = () => {
    inputRef.current?.click();
  };

  // Elimina la imagen seleccionada/previsualizada o la imagen previa
  const handleDelete = () => {
    setPreview(undefined); // Limpia la preview
    setPrevImageDeleted(true); // Marca la imagen previa como eliminada
    onChange(null); // Notifica al padre que no hay archivo
    if (inputRef.current) {
      inputRef.current.value = ''; // Limpia el input file
    }
  };

  // Cuando el usuario selecciona un archivo
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

  // DEBUG: Mostrar estado relevante
  // console.log('InputFile DEBUG:', {
  //   preview,
  //   placeholderImage,
  //   imageExists,
  //   showImageCard: !!placeholderImage && imageExists && !/imageService\.png([?#].*)?$/.test(placeholderImage)
  // });

  return (
    <div className="input-image-container">
      <label className="input-image-label">{label}</label>
      <div className="input-image-wrapper">
        <div className="input-image-preview">
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
          ) : (!!placeholderImage && imageExists && !/imageService\.png([?#].*)?$/.test(placeholderImage) && !prevImageDeleted) ? (
            <div className="input-image-card-container">
              {/* Muestra la imagen previa en una card pequeña */}
              <div className="input-image-card">
                <img src={placeholderImage} alt="Imagen actual" className="input-image-card-img" />
              </div>
              {/* Botón para eliminar la imagen previa */}
              <button type="button" className="input-image-card-delete-btn" onClick={handleDelete}>
                Eliminar imagen
              </button>
            </div>
          ) : (
            <div className="upload-placeholder" onClick={handleClick}>
              <div className="file-types">
                {/* Ícono de subir archivo */}
                <Upload style={{ fontSize: 34 }} />
                {/* Texto dinámico según el tipo de archivo aceptado */}
                <span>Subir {accept === 'video' ? 'video' : accept === 'image' ? 'imagen' : 'archivo'}</span>
              </div>
              {/* Texto con formatos y tamaños aceptados */}
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
            {/* Si hay preview (imagen/video seleccionada), muestra el botón de eliminar arriba a la derecha */}
            <IconButton 
              Icon={DeleteOutline} // Ícono de eliminar
              onClick={handleDelete} // Elimina la imagen seleccionada
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
      {/* Input file oculto, se activa al hacer click en la zona de carga */}
    </div>
  );
};

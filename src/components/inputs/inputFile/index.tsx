// Importa los hooks de React necesarios
import { useState, useRef, useEffect } from 'react';

// Importa íconos y componentes de UI
import { Upload, DeleteOutline } from '@mui/icons-material';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { IconButton } from '../../buttons/iconButton';
import './styled.css';

// Importar imagen por defecto para errores
import imageServicePlaceholder from '../../../assets/images/imageService.png';


// Función auxiliar para determinar si una URL es de video
const isVideo = (url: string | undefined) => {
  if (!url) return false;
  return url.startsWith('data:video/') || url.match(/\.(mp4|mov)$/i);
};

// Función auxiliar para determinar si una URL es externa (http/https)
const isExternalUrl = (url: string | undefined) => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

// Define las props que acepta el componente InputFile
interface InputFileProps {
  label: string; // Texto del label del input
  onChange: (file: File | null) => void; // Callback cuando cambia el archivo
  value?: string; // Valor inicial (para preview)
  accept?: 'image' | 'video' | 'both'; // Tipos aceptados
  maxSize?: number; // Tamaño máximo en MB (se usará si no se especifica maxImageSize o maxVideoSize)
  maxImageSize?: number; // Tamaño máximo para imágenes en MB
  maxVideoSize?: number; // Tamaño máximo para videos en MB
  placeholderImage?: string; // Imagen previa (si existe)
  placeholderVideo?: string; // Video previo (si existe)
  onDelete?: () => void; // Callback opcional para manejar la eliminación de archivos a nivel de aplicación
  error?: boolean; // Indica si hay un error en el campo
  errorMessage?: string; // Mensaje de error a mostrar
}

// Componente principal InputFile
export const InputFile = ({ 
  label, // Label a mostrar arriba del input
  onChange, // Función a ejecutar cuando cambia el archivo
  value, // Valor inicial para preview
  accept = 'image', // Por defecto solo imágenes
  maxSize = 5, // Tamaño máximo por defecto 5MB
  maxImageSize = 5, // Tamaño máximo para imágenes: 6MB
  maxVideoSize = 32, // Tamaño máximo para videos: 32MB
  placeholderImage, // Imagen previa (si existe)
  placeholderVideo, // Video previo (si existe)
  onDelete, // Callback opcional para manejar la eliminación de archivos
  error, // Indica si hay un error en el campo
  errorMessage // Mensaje de error a mostrar
}: InputFileProps) => {
  // Log para depuración
  const [preview, setPreview] = useState<string | undefined>(value);
  // Referencia al input file oculto
  const inputRef = useRef<HTMLInputElement>(null);
  // Estado para saber si la imagen o video previo fue eliminado
  const [prevMediaDeleted, setPrevMediaDeleted] = useState<boolean>(false);
  // Estado para controlar errores de tamaño
  const [sizeError, setSizeError] = useState<boolean>(false);
  // Mensaje de error para tamaño excedido
  const [sizeErrorMessage, setSizeErrorMessage] = useState<string>('');
  
  // Actualizar el preview cuando cambia el placeholder
  useEffect(() => {
    if (!prevMediaDeleted) {
      // Si hay placeholderVideo y el tipo aceptado incluye video, usar ese
      if (placeholderVideo && (accept === 'video' || accept === 'both')) {
       
        setPreview(placeholderVideo);
      }
      // Si hay placeholderImage y el tipo aceptado incluye imagen, usar ese
      else if (placeholderImage && (accept === 'image' || accept === 'both') && !preview) {
      
        setPreview(placeholderImage);
      }
    }
    
  
  }, [placeholderImage, placeholderVideo, preview, prevMediaDeleted, accept]);
  


  // Función para abrir el video en una nueva ventana
  const openVideoInNewWindow = (videoUrl: string) => {
   
    if (videoUrl) {
      // Abrir en nueva ventana con configuración para que se comporte como una ventana de reproductor
      window.open(videoUrl, '_blank', 'width=800,height=600,resizable=yes');
    }
  };

  // Log cuando cambia el estado de preview
  useEffect(() => {
   
  }, [preview, prevMediaDeleted, label, placeholderImage, placeholderVideo]);

  // Al hacer click en el área de carga, abre el input file oculto
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDelete = () => {
    // Limpiar la vista previa y marcar como eliminado
    setPreview(undefined);
    setPrevMediaDeleted(true);
  
    // Crear y enviar un archivo vacío como señal de eliminación
    const emptyFile = new File([], '', { type: 'image/png' });
    onChange?.(emptyFile); // Usa optional chaining por si onChange no está definido
  
    // Limpiar input file si existe
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    // Si se proporcionó un callback onDelete, llamarlo
    if (onDelete) {
    
      onDelete();
    }
  };

  // Función para convertir bytes a MB con 2 decimales
  const bytesToMB = (bytes: number): number => {
    return Math.round((bytes / (1024 * 1024)) * 100) / 100;
  };

  // Cuando el usuario selecciona un archivo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Si no hay archivo, limpiar el preview
    if (!file) {
      setPreview(undefined);
      onChange(null);
      return;
    }
    
    // Obtener y mostrar el peso del archivo en MB
    const fileSizeInBytes = file.size;
    const fileSizeInMB = bytesToMB(fileSizeInBytes);
    
    console.log(`Tipo de archivo: ${file.type}`);
    console.log(`Peso del archivo: ${fileSizeInMB} MB`);
    
    // Resetear errores de tamaño
    setSizeError(false);
    setSizeErrorMessage('');
    
    // Determinar el límite de tamaño según el tipo de archivo
    let sizeLimit = maxSize; // Por defecto
    let fileTypeText = 'archivo';
    
    if (file.type.startsWith('image/')) {
      sizeLimit = maxImageSize;
      fileTypeText = 'imagen';
      console.log(`Límite para imágenes: ${maxImageSize} MB`);
    } else if (file.type.startsWith('video/')) {
      sizeLimit = maxVideoSize;
      fileTypeText = 'video';
      console.log(`Límite para videos: ${maxVideoSize} MB`);
    }
    
    // Validar si el archivo excede el tamaño máximo permitido
    if (fileSizeInMB > sizeLimit) {
      console.log(`Error: El archivo excede el tamaño máximo permitido de ${sizeLimit} MB`);
      
      // Mostrar error visual
      setSizeError(true);
      setSizeErrorMessage(`El ${fileTypeText} excede el tamaño máximo permitido de ${sizeLimit} MB`);
    }
    
    onChange(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Determinar si tenemos un video (ya sea de preview o placeholderVideo)
  const hasVideo = (preview && isVideo(preview)) || (placeholderVideo && !prevMediaDeleted);
  
  // Determinar si tenemos una imagen (ya sea de preview o placeholderImage)
  const hasImage = (preview && !isVideo(preview)) || (placeholderImage && !/imageService\.png([?#].*)?$/.test(placeholderImage || '') && !prevMediaDeleted);
  
  // Determinar la URL del video a mostrar o abrir
  const videoUrl = isVideo(preview) ? preview : placeholderVideo;
  
  // Determinar si el video es local o externo
  const isLocalVideo = videoUrl && !isExternalUrl(videoUrl) && !videoUrl?.includes('/api/sign/v1/files/file/');
  
  
  // Extraer ternario anidado a variable arriba del return
  const mediaPreviewContent = hasVideo ? (
    <div className="input-image-card-container">
      <div className="input-image-card">
        {isLocalVideo ? (
          // Reproductor de video para archivos locales
          <video controls className="input-video-player" muted>
            <source src={videoUrl || ''} type="video/mp4" />
            {/* Agregar track para subtítulos para cumplir con estándares de accesibilidad */}
            <track kind="captions" label="Español" srcLang="es" src={null as any} default />
          </video>
        ) : (
          // Botón para abrir videos externos o de API
          <button
            type="button"
            className="video-icon-container"
            onClick={() => openVideoInNewWindow(videoUrl || '')}
            aria-label="Abrir video en nueva ventana"
          >
            <VideoCameraBackIcon className="video-icon" style={{ color: '#55b8e5' }} />
          </button>
        )}
      </div>
      {/* Botón para eliminar el video */}
      <button 
        type="button" 
        className="input-image-card-delete-btn" 
        onClick={handleDelete}
        aria-label="Eliminar video"
      >
        Eliminar video
      </button>
    </div>
  ) : hasImage ? (
    <div className="input-image-card-container">
      {/* Muestra la imagen previa en una card pequeña */}
      <div className="input-image-card">
        <img 
          src={preview || placeholderImage} 
          alt="Imagen actual" 
          className="input-image-card-img" 
          onError={(e) => {
            // Si hay error al cargar la imagen, usar la imagen por defecto
            e.currentTarget.src = imageServicePlaceholder;
          }}
        />
      </div>
      {/* Botón para eliminar la imagen previa */}
      <button 
        type="button" 
        className="input-image-card-delete-btn" 
        onClick={handleDelete}
        aria-label="Eliminar imagen"
      >
        Eliminar imagen
      </button>
    </div>
  ) : (
    <div 
      className="upload-placeholder" 
      onClick={handleClick} 
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        // Permitir activación con Enter o Space
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Subir ${accept === 'video' ? 'video' : accept === 'image' ? 'imagen' : 'archivo'}`}
      aria-describedby="file-upload-description"
    >
      <div className="file-types">
        {/* Ícono de subir archivo */}
        <Upload style={{ fontSize: 34 }} />
        {/* Texto dinámico según el tipo de archivo aceptado */}
        <span>Subir {accept === 'video' ? 'video' : accept === 'image' ? 'imagen' : 'archivo'}</span>
      </div>
      {/* Texto con formatos y tamaños aceptados */}
      <span id="file-upload-description">
        {accept === 'video' ? 
          `Formatos aceptados: MP4 y MOV. Tamaño máximo: ${maxVideoSize}MB` :
          accept === 'image' ? 
          `Las medidas recomendadas para la imagen son 300[ancho] x 240[alto] píxeles. Formatos: JPG y PNG. Tamaño máximo: ${maxImageSize}MB` :
          `Formatos aceptados: JPG, PNG (máx. ${maxImageSize}MB), MP4 y MOV (máx. ${maxVideoSize}MB)`
        }
      </span>
    </div>
  );

  return (
    <div className="input-image-container">
      <label className="input-image-label">{label}</label>
      <div className={`input-image-wrapper ${error || sizeError ? 'input-image-error' : ''}`}>
        <div className="input-image-preview">
          {mediaPreviewContent}
        </div>
        {preview && (
          <div 
            className="delete-image-button" 
            onClick={e => e.stopPropagation()}
            role="presentation"
            onKeyDown={e => {
              if (e.key === 'Escape') {
                e.stopPropagation();
              }
            }}
          >
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
      {(error && errorMessage) || (sizeError && sizeErrorMessage) ? (
        <div className="input-image-error-message">
          {error && errorMessage ? errorMessage : sizeErrorMessage}
        </div>
      ) : null}
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

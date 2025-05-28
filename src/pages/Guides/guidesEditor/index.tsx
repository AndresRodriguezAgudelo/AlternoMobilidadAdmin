import { TitleSearch } from '../../../components/titleSearch';
import { InputText } from '../../../components/inputs/inputText';
import { InputFile } from '../../../components/inputs/inputFile';
import { InputSelectModal } from '../../../components/inputs/inputSelectCategoryModal';
import { FatButton } from '../../../components/buttons/fatButton';
import { useState, useEffect } from 'react';
import './styled.css';
import { useGuideEditor } from '../../../customHooks/pages/guidesEditor/customHook';
import { AddPhotoAlternate } from '@mui/icons-material';
import { AddAPhoto } from '@mui/icons-material';

export const GuidesEditor = () => {
  const {
    formData,
    categoryOptions,
    loading,
    error,
    isEditing,
    handleSubmit,
    handleFieldChange,
    handleFileDelete,
    handleBack,
    fetchCategories,
  } = useGuideEditor();

  const [secAccept, setSecAccept] = useState<'image'|'video'|'both'>('both');
  const [tertAccept, setTertAccept] = useState<'image'|'video'|'both'>('both');
  // Activar campos secundario y terciario si existen datos o keys
  const [showSecondary, setShowSecondary] = useState<boolean>(false);
  const [showTertiary, setShowTertiary] = useState<boolean>(false);
  
  // Estados para controlar la validación de campos
  const [touchedFields, setTouchedFields] = useState({
    title: false,
    category: false,
    mainImage: false,
    description: false
  });
  
  // Estado para forzar la visualización del error de imagen principal
  const [forceMainImageError, setForceMainImageError] = useState(false);
  
  // Función para marcar un campo como tocado
  const markFieldAsTouched = (fieldName: string) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };
  
  // Verificar si hay errores en los campos requeridos
  const fieldErrors = {
    title: !formData.title && touchedFields.title,
    category: !formData.category && touchedFields.category,
    mainImage: (!formData.file && !formData.keyMain && !formData.data?.mainImageUrl && touchedFields.mainImage) || forceMainImageError,
    description: !formData.description && touchedFields.description
  };
  
  // Verificar si hay una imagen principal válida
  const hasValidMainImage = (
    // Hay un archivo nuevo que no es un archivo vacío (usado para eliminación)
    !!(formData.file && formData.file.size > 0) || 
    // Hay una clave de imagen existente Y no está marcada para eliminación
    !!(formData.keyMain && !formData.typeDeleted?.includes('file')) || 
    // Hay una URL de imagen principal en los datos
    !!(formData.data?.mainImageUrl)
  ) && !forceMainImageError; // Si se fuerza el error, consideramos que no hay imagen válida
  
  // Verificar si el formulario es válido para habilitar el botón guardar
  const isFormValid = !!(formData.title && 
                       formData.category && 
                       formData.description && 
                       hasValidMainImage);
  
  // Función específica para manejar la eliminación de la imagen principal
  const handleMainImageDelete = () => {
    // Primero marcamos el error para que se actualice la UI inmediatamente
    setForceMainImageError(true);
    markFieldAsTouched('mainImage');
    // Luego eliminamos el archivo
    handleFileDelete('file');
  };
  
  // Actualizar la visibilidad de los campos cuando cambian los datos
  useEffect(() => {
    // Mostrar campo secundario si hay datos o key
    const shouldShowSecondary = !!(formData.data?.secondaryImageUrl || formData.keySecondary);
    setShowSecondary(shouldShowSecondary);
    
    // Mostrar campo terciario si hay datos o key
    const shouldShowTertiary = !!(formData.data?.tertiaryVideoUrl || formData.keyTertiary);
    setShowTertiary(shouldShowTertiary);
  }, [formData.data, formData.keySecondary, formData.keyTertiary]);

  const handleAddInput = (type: 'image'|'video') => {
    // Si es una imagen, solo permitir agregarla como archivo secundario
    if (type === 'image') {
      if (!showSecondary) {
        setShowSecondary(true);
        setSecAccept('image'); // Forzar a que sea tipo imagen
      }
    } 
    // Si es un video, solo permitir agregarlo como archivo terciario
    else if (type === 'video') {
      if (!showTertiary) {
        setShowTertiary(true);
        setTertAccept('video'); // Forzar a que sea tipo video
      }
    }
  };

  return (
    <div className="guide-editor-container">
      <TitleSearch
        progressScreen={true}
        label={isEditing ? 'Editar guía' : 'Nueva guía'}
        onBack={handleBack}
        callToAction={{
          label: 'Guardar',
          onClick: handleSubmit,
          disabled: !isFormValid
        }}
      />

      {loading && <div style={{ textAlign: 'center', color: '#1976d2', margin: '24px 0' }}>Cargando datos de la guía...</div>}
      {error && <div style={{ textAlign: 'center', color: 'red', margin: '24px 0' }}>{error}</div>}

      <div className="guide-editor-form">
        <InputText
          label="Título"
          value={formData.title}
          onChange={(value) => {
            handleFieldChange('title', value);
            markFieldAsTouched('title');
          }}
          error={fieldErrors.title}
          errorMessage={fieldErrors.title ? 'Este campo es obligatorio' : ''}
        />

        <InputSelectModal
          label="Categoría"
          options={categoryOptions}
          value={formData.category}
          onChange={(value) => {
            handleFieldChange('category', value);
            markFieldAsTouched('category');
          }}
          onAddCategorySuccess={fetchCategories}
          error={fieldErrors.category}
          errorMessage={fieldErrors.category ? 'Este campo es obligatorio' : ''}
        />

        <InputFile
          label="Imagen Principal"
          onChange={(file) => {
            handleFieldChange('file', file);
            markFieldAsTouched('mainImage');
            // Si se agrega un archivo, quitar el error forzado
            if (file) setForceMainImageError(false);
          }}
          placeholderImage={
            // Priorizar la URL directa de data.main si existe
            formData.data?.mainImageUrl || 
            (isEditing && formData.keyMain && !formData.keyMain.includes('imageService.png')
              ? `/api/sign/v1/files/file/${formData.keyMain}`
              : undefined)
          }
          onDelete={handleMainImageDelete}
          error={fieldErrors.mainImage}
          errorMessage={fieldErrors.mainImage ? 'Este campo es obligatorio' : ''}
        />

        {showSecondary && (
          <InputFile
            label="Imagen Secundario"
            onChange={(file) => handleFieldChange('fileSecondary', file)}
            accept={secAccept}
            placeholderImage={
              // Priorizar la URL directa de data.secondary si existe
              formData.data?.secondaryImageUrl || 
              (isEditing && formData.keySecondary && !formData.keySecondary.includes('imageService.png') 
                ? `/api/sign/v1/files/file/${formData.keySecondary}` 
                : undefined)
            }
            onDelete={() => handleFileDelete('fileSecondary')}
          />
        )}
        {showTertiary && (
          <InputFile
            label="Archivo de video"
            onChange={(file) => handleFieldChange('fileTertiary', file)}
            accept={tertAccept}
            placeholderVideo={
              // Priorizar la URL directa de data.tertiaryVideo si existe
              formData.data?.tertiaryVideoUrl	 || 
              (isEditing && formData.keyTertiary && !formData.keyTertiary.includes('imageService.png') 
                ? `/api/sign/v1/files/file/${formData.keyTertiary}` 
                : undefined)
            }
            onDelete={() => handleFileDelete('fileTertiary')}
          />
        )}
        <InputText
          label="Texto"
          value={formData.description}
          onChange={(value) => {
            handleFieldChange('description', value);
            markFieldAsTouched('description');
          }}
          heightSize={200}
          error={fieldErrors.description}
          errorMessage={fieldErrors.description ? 'Este campo es obligatorio' : ''}
        />
        <div className="add-file-buttons">
          <FatButton 
            Icon={AddAPhoto} 
            textColor='#55b8e5'  
            backgroundColor="white" 
            label="Agregar Video" 
            onClick={() => handleAddInput('video')} 
            disabled={showTertiary} // Deshabilitar si ya se muestra el archivo terciario
          />
          <FatButton 
            Icon={AddPhotoAlternate} 
            textColor='#55b8e5'  
            backgroundColor="white" 
            label="Agregar Foto" 
            onClick={() => handleAddInput('image')} 
            disabled={showSecondary} // Deshabilitar si ya se muestra el archivo secundario
          />
        </div>
      </div>
    </div>
  );
};

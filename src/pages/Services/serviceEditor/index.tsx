import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TitleSearch } from '../../../components/titleSearch';
import { InputText } from '../../../components/inputs/inputText';
import { InputFile } from '../../../components/inputs/inputFile';
import { Loading } from '../../../components/loading';
import { useServices } from '../../../customHooks/pages/services/customHook';
// Ya no necesitamos importar API_BASE_URL
import './styled.css';

export const ServiceEditor = () => {
  const { id } = useParams();
  const serviceId = id ? parseInt(id) : undefined;
  const navigate = useNavigate();
  const isEditing = !!serviceId;

  const { createService, updateService, getServiceById, fetchServices } = useServices();
  
  const [formData, setFormData] = useState({
    name: '',
    webLink: '',
    description: '',
    image: undefined as File | undefined,
    imageChanged: false // NUEVO: indica si la imagen fue cambiada
  });

  // Estados para controlar la validación de campos
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    webLink: false,
    description: false,
    image: false
  });

  // Estado para forzar la visualización del error de imagen
  const [forceImageError, setForceImageError] = useState(false);

  // Función para marcar un campo como tocado
  const markFieldAsTouched = (fieldName: string) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      image: file || undefined,
      imageChanged: !!file // true si hay archivo, false si se borra
    }));
  };
  
  // Estado para controlar si estamos cargando los datos del servicio
  const [loadingServiceData, setLoadingServiceData] = useState(false);

  // Estado para almacenar la URL de la imagen del servicio
  const [serviceImageUrl, setServiceImageUrl] = useState<string | undefined>(undefined);
  
  // Función específica para manejar la eliminación de la imagen
  const handleImageDelete = () => {
    // Primero marcamos el error para que se actualice la UI inmediatamente
    setForceImageError(true);
    markFieldAsTouched('image');
    // Luego eliminamos la imagen
    handleImageChange(null);
    // Limpiar la URL de la imagen
    setServiceImageUrl(undefined);
  };

  useEffect(() => {
    // Función asíncrona para cargar los datos del servicio
    const loadServiceData = async () => {
      if (isEditing && serviceId) {
        try {
          setLoadingServiceData(true);
          // Forzamos una petición al backend para obtener los datos más recientes
          const service = await getServiceById(serviceId, true);
          
          if (service) {
            if (service.imageUrl) {
              setServiceImageUrl(service.imageUrl);
            }
            
            setFormData({
              name: service.name || '',
              webLink: service.link || '',
              description: service.description || '',
              image: undefined, // La imagen existente ya está en el key
              imageChanged: false // <-- necesario para cumplir el tipado
            });
          } 
        }
        
        catch (error) { } 
        
        finally {
          setLoadingServiceData(false);
        }
      }
    };

    loadServiceData();
    // No incluir getServiceById en las dependencias para evitar bucles infinitos
  }, [isEditing, serviceId]);

  // Verificar si hay errores en los campos requeridos
  const fieldErrors = {
    name: !formData.name && touchedFields.name,
    webLink: !formData.webLink && touchedFields.webLink,
    description: !formData.description && touchedFields.description,
    image: (!formData.image && !serviceImageUrl && touchedFields.image) || forceImageError
  };
  
  // Verificar si hay una imagen válida
  const hasValidImage = !!(formData.image || serviceImageUrl) && !forceImageError;

  // Verificar si el formulario es válido para habilitar el botón guardar
  const isFormValid = !!(formData.name && 
                       formData.webLink && 
                       formData.description && 
                       hasValidImage);
                        

  const handleSave = async () => {
    // Marcar todos los campos como tocados para mostrar errores
    setTouchedFields({
      name: true,
      webLink: true,
      description: true,
      image: true
    });

    // Si el formulario no es válido, no continuar
    if (!isFormValid) {
      console.error('Por favor, complete todos los campos obligatorios');
      return;
    }

    // Asegurarse de que el link tenga el formato correcto
    const link = formData.webLink.toLowerCase().startsWith('http') 
      ? formData.webLink 
      : `https://${formData.webLink}`;
    
    try {
      let success = false;
      
      if (isEditing && serviceId) {
        // Para edición, solo enviamos los campos que tenemos
        const updateData: any = {
          name: formData.name,
          link: link,
          description: formData.description,
        };
        // Solo agrega la imagen si fue cambiada
        if (formData.imageChanged && formData.image) {
          updateData.image = formData.image;
        }
        const result = await updateService(serviceId, updateData);
        success = result.success;
      } else {
        const createData = {
          name: formData.name,
          link: link,
          description: formData.description,
          image: formData.image as File // Ya validamos que existe
        };
        const result = await createService(createData);
        success = result.success;
      }
      if (success) {
        // Forzar una actualización de la lista antes de navegar
        await fetchServices();
        navigate('/services');
      }
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
    }
  };

  const handleBack = () => {
    navigate('/services');
  };

  return (
    <div className="service-editor-container">
      <TitleSearch 
        label={isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
        progressScreen={true}
        onBack={handleBack}
        callToAction={{
          label: 'Guardar',
          onClick: handleSave,
          disabled: !isFormValid
        }}
      />
      
      {loadingServiceData ? (
        <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loading size="large" />
        </div>
      ) : (
        <div className="service-editor-form">
        <InputText
          label="Nombre"
          value={formData.name}
          onChange={(value) => {
            handleInputChange('name')(value);
            markFieldAsTouched('name');
          }}
          error={fieldErrors.name}
          errorMessage={fieldErrors.name ? 'Este campo es obligatorio' : ''}
        />
        
        <InputText
          label="Enlace Web"
          value={formData.webLink}
          onChange={(value) => {
            handleInputChange('webLink')(value);
            markFieldAsTouched('webLink');
          }}
          error={fieldErrors.webLink}
          errorMessage={fieldErrors.webLink ? 'Este campo es obligatorio' : ''}
        />
        
        <InputText
          label="Descripción"
          value={formData.description}
          onChange={(value) => {
            handleInputChange('description')(value);
            markFieldAsTouched('description');
          }}
          heightSize={115}
          error={fieldErrors.description}
          errorMessage={fieldErrors.description ? 'Este campo es obligatorio' : ''}
        />
        
        <InputFile
          label="Imagen"
          onChange={(file) => {
            handleImageChange(file);
            markFieldAsTouched('image');
            // Si se agrega un archivo, quitar el error forzado
            if (file) setForceImageError(false);
          }}
          placeholderImage={serviceImageUrl}
          onDelete={handleImageDelete}
          error={fieldErrors.image}
          errorMessage={fieldErrors.image ? 'Este campo es obligatorio' : ''}
        />
      </div>
      )}
    </div>
  );
};

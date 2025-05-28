import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TitleSearch } from '../../../components/titleSearch';
import { InputText } from '../../../components/inputs/inputText';
import { InputFile } from '../../../components/inputs/inputFile';
import { useServices } from '../../../customHooks/pages/services/customHook';
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

  useEffect(() => {
    if (isEditing && serviceId) {
      const service = getServiceById(serviceId);
      if (service) {
        setFormData({
          name: service.name,
          webLink: service.link,
          description: service.description,
          image: undefined, // La imagen existente ya está en el key
          imageChanged: false // <-- necesario para cumplir el tipado
        });
      }
    }
  }, [isEditing, serviceId]);

  const handleSave = async () => {
    // Validar campos requeridos
    if (!formData.name || !formData.webLink || !formData.description) {
      console.error('Todos los campos son requeridos');
      return;
    }

    // Validar imagen para nuevo servicio
    if (!isEditing && !formData.image) {
      console.error('La imagen es requerida para crear un nuevo servicio');
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
        // Para creación, la imagen es requerida
        //console.log('File object:', formData.image);
        //console.log('File type:', formData.image?.type);
        //console.log('File size:', formData.image?.size);
        
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
          onClick: handleSave
        }}
      />
      
      <div className="service-editor-form">
        <InputText
          label="Nombre"
          value={formData.name}
          onChange={handleInputChange('name')}
        />
        
        <InputText
          label="Enlace Web"
          value={formData.webLink}
          onChange={handleInputChange('webLink')}
        />
        
        <InputText
          label="Descripción"
          value={formData.description}
          onChange={handleInputChange('description')}
          heightSize={115}
        />
        
        <InputFile
          label="Imagen"
          onChange={handleImageChange}
          placeholderImage={
            isEditing && serviceId && getServiceById(serviceId)?.key &&
            !getServiceById(serviceId)!.key.includes('imageService.png')
              ? `/api/sign/v1/files/file/${getServiceById(serviceId)!.key}`
              : undefined
          }
        />
      </div>
    </div>
  );
};

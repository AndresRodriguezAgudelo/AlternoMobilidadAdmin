import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TitleSearch } from '../../../components/titleSearch';
import { InputText } from '../../../components/inputs/inputText';
import { InputFile } from '../../../components/inputs/inputFile';
import { InputSelect } from '../../../components/inputs/inputSelect';
import { FatButton } from '../../../components/buttons/fatButton';
import './styled.css';
import { ENDPOINTS } from '../../../services/endPoints';
import { api } from '../../../services/api';

export const GuidesEditor = () => {
  const { id } = useParams();
  const guideId = id ? parseInt(id) : undefined;
  const navigate = useNavigate();
  const isEditing = !!guideId;

  const categoryOptions = [
    'Consejos',
    'Guías', 
    'Tips'
  ];

  interface FileItem {
    file: File | null;
    type: 'image' | 'video';
  }

  const [formData, setFormData] = useState({
    title: '',
    category: 'consejos',
    mainImage: null as File | null,
    description: '',
    keyMain: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guideId) return;
    setLoading(true);
    setError(null);
    api.get(ENDPOINTS.GUIDES.DETAIL(guideId))
      .then(({ data }) => {
        setFormData(prev => ({
          ...prev,
          title: data.name || '',
          category: data.categoryId ? String(data.categoryId) : '',
          description: data.description || '',
          mainImage: null,
          keyMain: data.keyMain || '',
        }));
      })
      .catch(err => {
        setError('No se pudo cargar la guía.');
      })
      .finally(() => setLoading(false));
  }, [guideId]);

  const handleBack = () => {
    navigate('/guias');
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, mainImage: file }));
  };

  const handleSubmit = async () => {
    if (!guideId) return;
    setLoading(true);
    setError(null);
    try {
      let payload: any = {
        name: formData.title,
        description: formData.description
      };
      if (formData.mainImage instanceof File) {
        const formDataData = new FormData();
        formDataData.append('name', formData.title);
        formDataData.append('description', formData.description);
        formDataData.append('file', formData.mainImage);
        payload = formDataData;
      }
      let headers: any = {};
      if (formData.mainImage instanceof File) {
        headers['Content-Type'] = 'multipart/form-data';
      }
      // Mostrar el body que se va a enviar
      if (payload instanceof FormData) {
        // Mostrar todas las entradas del FormData
        for (let pair of payload.entries()) {
          console.log('FormData PATCH:', pair[0], pair[1]);
        }
      } else {
        console.log('JSON PATCH:', JSON.stringify(payload));
      }
      await api.patch(
        ENDPOINTS.GUIDES.DETAIL(guideId),
        payload,
        headers['Content-Type'] ? { headers, transformRequest: [(data: any) => data] } : undefined
      );
      setLoading(false);
      navigate('/guias');
    } catch (err) {
      setError('Error al actualizar la guía');
      setLoading(false);
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
          onClick: handleSubmit
        }}
      />

      {loading && <div style={{ textAlign: 'center', color: '#1976d2', margin: '24px 0' }}>Cargando datos de la guía...</div>}
      {error && <div style={{ textAlign: 'center', color: 'red', margin: '24px 0' }}>{error}</div>}

      <div className="guide-editor-form">
        <InputText
          label="Título"
          value={formData.title}
          onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
        />

        <InputSelect
          label="Categoría"
          value={formData.category}
          options={categoryOptions}
          onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        />

        <InputFile
          label="Imagen Principal"
          onChange={(file) => setFormData(prev => ({ ...prev, mainImage: file }))}
          placeholderImage={
            isEditing && guideId && formData.keyMain && !formData.keyMain.includes('imageService.png')
              ? `/api/sign/v1/files/file/${formData.keyMain}`
              : undefined
          }
        />

        <InputText
          label="Descripción"
          value={formData.description}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          heightSize={200}
        />


      </div>
    </div>
  );
};

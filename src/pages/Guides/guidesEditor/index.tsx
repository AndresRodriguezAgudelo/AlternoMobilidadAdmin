import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TitleSearch } from '../../../components/titleSearch';
import { InputText } from '../../../components/inputs/inputText';
import { InputFile } from '../../../components/inputs/inputFile';
import { InputSelect } from '../../../components/inputs/inputSelect';
import { FatButton } from '../../../components/buttons/fatButton';
import './styled.css';

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
    additionalFiles: [] as FileItem[]
  });

  const handleBack = () => {
    navigate('/guias');
  };

  const handleSubmit = async () => {
    // TODO: Implementar la lógica de guardado
    console.log('Form data:', formData);
    handleBack();
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
        />

        <InputText
          label="Descripción"
          value={formData.description}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          heightSize={200}
        />

        {formData.additionalFiles.map((item, index) => (
          <InputFile
            key={index}
            label={`${item.type === 'image' ? 'Imagen' : 'Video'} Adicional ${index + 1}`}
            accept={item.type}
            onChange={(file) => {
              const newFiles = [...formData.additionalFiles];
              if (file) {
                newFiles[index] = { ...newFiles[index], file };
              } else {
                newFiles.splice(index, 1);
              }
              setFormData(prev => ({ ...prev, additionalFiles: newFiles }));
            }}
          />
        ))}

        <div className="add-file-buttons">
          <FatButton
            label="Agregar Imagen"
            onClick={() => setFormData(prev => ({
              ...prev,
              additionalFiles: [...prev.additionalFiles, { file: null, type: 'image' }]
            }))}
          />
          <FatButton
            label="Agregar Video"
            onClick={() => setFormData(prev => ({
              ...prev,
              additionalFiles: [...prev.additionalFiles, { file: null, type: 'video' }]
            }))}
          />
        </div>
      </div>
    </div>
  );
};

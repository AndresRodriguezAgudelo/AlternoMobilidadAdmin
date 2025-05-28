import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleSearch } from '../../components/titleSearch';
import { GuideCard } from '../../components/guideCard';
import { useGuides } from '../../customHooks/pages/guides/customHook';
import imageTest from '../../assets/images/imageService.png';

import './styled.css';

const Guides = () => {

  const { guides = [], loading, error, setParams } = useGuides();

  const [searchTerm, setSearchTerm] = useState('');

  console.log(searchTerm);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setParams(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const navigate = useNavigate();

  const handleAddGuide = () => {
    navigate('/guias/guiasEditor');
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Debugging logs
  console.log('[Guides] guides:', guides);
  console.log('[Guides] loading:', loading);
  console.log('[Guides] error:', error);

  return (
    <div className="guides-container">
      <TitleSearch
        progressScreen={false}
        label="Gestión de guías"
        onSearch={handleSearch}
        callToAction={{
          label: 'Agregar guía',
          onClick: handleAddGuide
        }}
      />

      <div className="guides-list">
        {loading ? (
          <div>Cargando guías...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>Error al cargar guías: {error}</div>
        ) : guides && guides.length > 0 ? (
          guides.map(guide => (
            <GuideCard
              key={guide.id}
              imageUrl={guide.keyMain ? `/api/sign/v1/files/file/${guide.keyMain}` : imageTest}
              title={guide.name}
              category={`Categoría ${guide.categoryId}`}
              date="2024-02-27"
              onEdit={() => navigate(`/guias/guiasEditor/${guide.id}`)}
              onDelete={() => console.log('Eliminar guía', guide.id)}
            />
          ))
        ) : (
          <div style={{ color: '#888' }}>No hay guías disponibles</div>
        )}
      </div>
    </div>
  );
};

export default Guides;
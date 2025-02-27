import { useState } from 'react';
import { TitleSearch } from '../../components/titleSearch';
import { GuideCard } from '../../components/guideCard';
import { useGuides } from '../../customHooks/pages/guides/customHook';
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

  const handleAddGuide = () => {
    // Implementar navegación a la página de creación de guías
    console.log('Navegar a crear guía');
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          <div>Cargando...</div>
        ) : guides && guides.length > 0 ? (
          guides.map(guide => (
            <GuideCard
              key={guide.id}
              imageUrl={guide.keyMain}
              title={guide.name}
              category={`Categoría ${guide.categoryId}`}
              date="2024-02-27"
              onEdit={() => console.log('Editar guía', guide.id)}
              onDelete={() => console.log('Eliminar guía', guide.id)}
            />
          ))
        ) : (
          <div>No hay guías disponibles</div>
        )}
      </div>
    </div>
  );
};

export default Guides;
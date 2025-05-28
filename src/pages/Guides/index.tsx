import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleSearch } from '../../components/titleSearch';
import { GuideCard } from '../../components/guideCard';

import { useGuides } from '../../customHooks/pages/guides/customHook';

import imageTest from '../../assets/images/imageService.png';

import { api } from '../../services/api';
import { ENDPOINTS } from '../../services/endPoints';
import { showConfirmationModal } from '../../components/confirmationModal';

import './styled.css';

// Constante que define el número máximo de guías permitidas
const MAX_GUIDES = 12;

const Guides = () => {

  const { guides = [], loading, error, setParams, deleteGuide, deleteLoading } = useGuides();
  const [categories, setCategories] = useState<{id:number;name:string}[]>([]);

  const handleSearch = (value: string) => {
    setParams(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const navigate = useNavigate();

  const handleAddGuide = () => {
    // Verificar si se ha alcanzado el número máximo de guías
    if (guides.length >= MAX_GUIDES) {
      showConfirmationModal({
        title: 'Límite de guías alcanzado',
        content: `Has alcanzado el número máximo de guías permitidas (${MAX_GUIDES}). Para agregar una nueva guía, debes eliminar alguna existente.`,
        buttonText: 'Entendido',
        onAction: () => {},
        showCancelButton: false
      });
    } else {
      navigate('/guias/guiasEditor');
    }
  };

  const handleDeleteClick = (id: number) => {
    showConfirmationModal({
      title: '¿Estás seguro de que deseas eliminar esta guía?',
      content: 'Esta acción no se puede deshacer.',
      buttonText: deleteLoading ? 'Eliminando...' : 'Confirmar',
      onAction: async () => {
        // Usa la función del custom hook para eliminar la guía
        await deleteGuide(id);
      }
    });
  };

  useEffect(() => {
    api.get(ENDPOINTS.CATEGORIES.LIST, { params: { order: 'ASC', page: 1, take: 50 } })
      .then(({ data }) => {
        const opts = data.data.map((c: any) => ({ id: c.id, name: c.categoryName }));
        setCategories(opts);
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);



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
          <div>Cargando guías...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>Error al cargar guías: {error}</div>
        ) : guides && guides.length > 0 ? (
          guides.map(guide => (
            <GuideCard
              key={guide.id}
              imageUrl={guide.data?.mainImageUrl || imageTest}
              title={guide.name}
              description={guide.description}
              category={categories.find(c=>c.id===guide.categoryId)?.name ?? `Categoría ${guide.categoryId}`}
              date={guide.createdAt ? new Date(guide.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'Sin fecha'}
              onEdit={() => navigate(`/guias/guiasEditor/${guide.id}`)}
              onDelete={() => handleDeleteClick(guide.id)}
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
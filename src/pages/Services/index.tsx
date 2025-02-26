import { TitleSearch } from '../../components/titleSearch';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '../../components/serviceCard';
import { useServices } from '../../customHooks/pages/services/customHook';
import imageTest from '../../assets/images/imageService.png';
import { Loading } from '../../components/loading';
import './styled.css';

const Services = () => {
  const navigate = useNavigate();
  const { services, loading, updateServiceOrder, deleteService } = useServices();
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const handleAddService = () => {
    navigate('/services/serviceEditor');
  };

  const handleEditService = (id: number) => {
    navigate(`/services/serviceEditor/${id}`);
  };

  const handleDragStart = (id: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDrop = (targetId: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const sourceId = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceId !== targetId) {
      updateServiceOrder(sourceId, targetId);
      setHighlightedId(targetId);
      setTimeout(() => setHighlightedId(null), 1000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="services-container">
      <TitleSearch 
        progressScreen={false}
        label="Gestion de Servicios"
        subTitle="Mantén presionado el servicio para arrastrarlo y reorganizar su posición en la app"
        callToAction={{
          label: 'Agregar servicio',
          onClick: handleAddService
        }}
      />
      <div className="services-list" onDragOver={handleDragOver}>
        {loading ? (
          <div className="services-loading">
            <Loading size="large" />
          </div>
        ) : services.map((service) => (
          <div key={service.id} onDrop={handleDrop(service.id)}>
            <ServiceCard
              id={service.id}
              image={imageTest}
              link={service.link}
              description={service.description}
              onEdit={() => handleEditService(service.id)}
              onDelete={() => deleteService(service.id)}
              onDragStart={handleDragStart(service.id)}
              isHighlighted={service.id === highlightedId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;

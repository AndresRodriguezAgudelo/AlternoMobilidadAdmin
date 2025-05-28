import { TitleSearch } from '../../components/titleSearch';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '../../components/serviceCard';
import { useServices } from '../../customHooks/pages/services/customHook';
import imageTest from '../../assets/images/imageService.png';
import { Loading } from '../../components/loading';
import { showConfirmationModal } from '../../components/confirmationModal';
import './styled.css';
import { Service } from '../../store/services';

// Constante que define el número máximo de servicios permitidos
const MAX_SERVICES = 12;

const Services = () => {
  const navigate = useNavigate();
  const { services, loading, updateServiceOrder, deleteService } = useServices();
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const handleAddService = () => {
    // Verificar si se ha alcanzado el número máximo de servicios
    if (services.length >= MAX_SERVICES) {
      showConfirmationModal({
        title: 'Límite de servicios alcanzado',
        content: `Has alcanzado el número máximo de servicios permitidos (${MAX_SERVICES}). Para agregar un nuevo servicio, debes eliminar alguno existente.`,
        buttonText: 'Entendido',
        onAction: () => {},
        showCancelButton: false
      });
    } else {
      navigate('/services/serviceEditor');
    }
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
        ) : services.map((service: Service, index: number) => (
          <div key={service.id} onDrop={handleDrop(service.id)}>
            <ServiceCard
              id={index + 1}
              image={service.imageUrl ? service.imageUrl : imageTest}
             // link={service.link}
              description={service.name}
              onEdit={() => handleEditService(service.id)}
              onDelete={() => {
                showConfirmationModal({
                  title: '¿Estás seguro de que deseas eliminar este servicio?',
                  content: 'Esta acción no se puede deshacer.',
                  buttonText: 'Confirmar',
                  onAction: () => deleteService(service.id)
                });
              }}
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

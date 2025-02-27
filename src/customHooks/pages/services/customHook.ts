// Importamos los hooks necesarios de React y nuestras utilidades
import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';
import { useServicesStore, Service } from '../../../store/services';


// Interfaz para crear un nuevo servicio - la imagen es obligatoria
interface CreateServiceInput {
  name: string;         // Nombre del nuevo servicio
  link: string;         // URL del servicio
  description: string;  // Descripción del servicio
  image: File;          // Archivo de imagen (obligatorio para crear)
}

// Interfaz para actualizar un servicio - todos los campos son opcionales
interface UpdateServiceInput {
  name?: string;        // Nombre opcional
  link?: string;        // URL opcional
  description?: string; // Descripción opcional
  image?: File;         // Imagen opcional
}

// Tipo para la actualización de servicios
type UpdateServiceDTO = UpdateServiceInput;

// Interfaz para la respuesta paginada del backend
interface ServiceResponse {
  data: Service[];            // Array de servicios
  meta: {                     // Metadatos de paginación
    page: string;             // Página actual
    take: string;             // Elementos por página
    total: number;            // Total de elementos
    pageCount: number;        // Total de páginas
    hasPreviousPage: boolean; // Hay página anterior
    hasNextPage: boolean;     // Hay página siguiente
  };
}

// Parámetros para la consulta de servicios
interface ServiceParams {
  page?: number;            // Número de página
  take?: number;            // Elementos por página
  order?: 'ASC' | 'DESC';   // Orden de los resultados
  search?: string;          // Término de búsqueda
}

// Hook personalizado para gestionar los servicios
export const useServices = () => {
  // Estado global de servicios usando Zustand
  const { services: storedServices, setServices } = useServicesStore();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);                             // Estado de carga
  const [error, setError] = useState<string | null>(null);                  // Estado de error
  const [meta, setMeta] = useState<ServiceResponse['meta'] | null>(null);   // Metadatos de paginación

  // Estado para parámetros de consulta con valores por defecto
  const [params, setParams] = useState<ServiceParams>({
    page: 1,      // Primera página
    take: 10,     // 10 elementos por página
    order: 'ASC'  // Orden ascendente
  });

  // Función para obtener la lista de servicios del backend
  const fetchServices = async (
      page: number = 1, 
      take: number = 10, 
      order: 'ASC' | 'DESC' = 'ASC', 
      search?: string
    ) => {
    try {
      //console.log('[Services Hook] Starting to fetch services');
      setLoading(true);

      
      // const token = localStorage.getItem('token');

      //console.log(localStorage)
      //console.log('[Services Hook] Current token:', token);

      const params: Record<string, any> = {
        page,
        take,
        order
      };

      if (search) {
        params.search = search;
      }

      //console.log('[Services Hook] Fetching with params:', params);

      const response = await api.get<ServiceResponse>(ENDPOINTS.SERVICES.LIST, {
        params
      });

      //console.log('[Services Hook] Services fetched successfully:', response.data);

      setServices(response.data.data);
      //console.log('[Services Hook] Services stored in global state');
      setMeta(response.data.meta);
      setError(null);
    } catch (err) {
      console.error('[Services Hook] Error details:', err);
      setError('Error al cargar los servicios');
    } finally {
      setLoading(false);
      //console.log('[Services Hook] Fetch operation completed');
    }
  };

  useEffect(() => {
    // Si hay servicios en el store y no hay cambios en los parámetros, no hacemos fetch
    if (storedServices.length > 0 &&
      params.page === 1 &&
      params.take === 10 &&
      params.order === 'ASC' &&
      !params.search) {
      //console.log('[Services Hook] Using stored services:', storedServices.length);
      setLoading(false);
      return;
    }

    //console.log('[Services Hook] Fetching services with params:', params);
    fetchServices(params.page, params.take, params.order, params.search);
  }, [params]);

  const updateServiceOrder = (fromId: number, toId: number) => {
    const updatedServices = (prevServices: Service[]): Service[] => {
      const newServices = [...prevServices];
      const fromIndex = newServices.findIndex(service => service.id === fromId);
      const toIndex = newServices.findIndex(service => service.id === toId);

      // Reordenar el array
      const [movedService] = newServices.splice(fromIndex, 1);
      newServices.splice(toIndex, 0, movedService);

      // Actualizar IDs basados en la nueva posición
      return newServices.map((service, index) => ({
        ...service,
        id: index + 1
      }));
    };
    setServices(updatedServices);
  };

  /**
   * Crea un nuevo servicio con imagen
   * @param serviceData Datos del servicio incluyendo nombre, link, descripción e imagen
   * @returns Objeto con el resultado de la operación
   */


  const createService = async (serviceData: CreateServiceInput) => {
    try {
      // Iniciar estado de carga
      setLoading(true);

      // Crear FormData para enviar datos multipart/form-data
      const formData = new FormData();

      // Validar que la imagen sea un archivo válido
      if (!(serviceData.image instanceof File)) {
        throw new Error('La imagen debe ser un archivo válido');
      }

      // Agregar todos los campos al FormData
      formData.append('file', serviceData.image);        // Archivo de imagen
      formData.append('name', serviceData.name);         // Nombre del servicio
      formData.append('link', serviceData.link);         // URL del servicio
      formData.append('description', serviceData.description); // Descripción

      // Obtener el token de autorización para la petición
      const authHeader = api.defaults.headers.common['Authorization'];

      // Realizar la petición POST al backend
      const response = await api.post<Service>(
        ENDPOINTS.SERVICES.LIST,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',    // Importante para archivos
            'Authorization': authHeader as string     // Token de autorización
          },
          transformRequest: [(data) => data]  // Evitar transformación del FormData
        }
      );

      await fetchServices();
      return { success: true, data: response.data };

    }

    catch (err) {
      console.error('[Services Hook] Error creating service:', err);
      setError('Error al crear el servicio');
      return { success: false, error: 'Error al crear el servicio' };
    }

    finally {
      setLoading(false);
    }
  };

  const updateService = async (id: number, serviceData: UpdateServiceDTO) => {
    try {
      setLoading(true);
      const response = await api.patch<Service>(`${ENDPOINTS.SERVICES.LIST}/${id}`, serviceData);
      // Forzar una actualización completa de la lista para mantener la consistencia
      await fetchServices();
      return { success: true, data: response.data };
    } catch (err) {
      console.error('[Services Hook] Error updating service:', err);
      setError('Error al actualizar el servicio');
      return { success: false, error: 'Error al actualizar el servicio' };
    } finally {
      setLoading(false);
    }
  };

  const getServiceById = (id: number): Service | undefined => {
    return storedServices.find(service => service.id === id);
  };

  const deleteService = (id: number) => {
    const updatedServices = (prevServices: Service[]): Service[] =>
      prevServices
        .filter(service => service.id !== id)
        .map((service, index) => ({
          ...service,
          id: index + 1
        }));
    setServices(updatedServices);
  };

  const updateParams = (newParams: Partial<ServiceParams>) => {
    setParams(prev => ({
      ...prev,
      ...newParams
    }));
  };

  return {
    services: storedServices,
    loading,
    error,
    meta,
    params,
    updateParams,
    updateServiceOrder,
    deleteService,
    fetchServices,
    createService,
    updateService,
    getServiceById
  };
};

// Importamos los hooks necesarios de React y nuestras utilidades
import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';
import { Service } from '../../../store/services';


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
  // Estados locales para manejar la UI
  const [services, setServices] = useState<Service[]>([]);                  // Estado local de servicios
  const [loading, setLoading] = useState(true);                             // Estado de carga
  const [error, setError] = useState<string | null>(null);                  // Estado de error
  const [meta, setMeta] = useState<ServiceResponse['meta'] | null>(null);   // Metadatos de paginación

  // Estado para parámetros de consulta con valores por defecto
  const [params, setParams] = useState<ServiceParams>({
    page: 1,      // Primera página
    take: 20,     // 20 elementos por página
    order: 'ASC'  // Orden ascendente
  });

  // Función para obtener la lista de servicios del backend
  const fetchServices = async (
      page: number = 1, 
      take: number = 12, 
      order: 'ASC' | 'DESC' = 'ASC', 
      search?: string
    ) => {
    try {
      setLoading(true);

      const params: Record<string, any> = {
        page,
        take,
        order
      };

      if (search) {
        params.search = search;
      }
      const response = await api.get<ServiceResponse>(ENDPOINTS.SERVICES.LIST, {
        params
      });

      setServices(response.data.data);
      setMeta(response.data.meta);
      setError(null);
    } catch (err) {
      console.error('[Services Hook] Error details:', err);
      setError('Error al cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Si hay servicios en el store y no hay cambios en los parámetros, no hacemos fetch


  
    fetchServices(params.page, params.take, params.order, params.search);
  }, [params]);

  const updateServiceOrder = async (fromId: number, toId: number) => {
  setLoading(true);
  try {
    // Reordenar localmente y obtener el nuevo orden
    let newOrder: Service[] = [];
    setServices((prevServices: Service[]) => {
      const newServices = [...prevServices];
      const fromIndex = newServices.findIndex(service => service.id === fromId);
      const toIndex = newServices.findIndex(service => service.id === toId);
      const [movedService] = newServices.splice(fromIndex, 1);
      newServices.splice(toIndex, 0, movedService);
      newOrder = newServices;
      return newServices;
    });

    // Esperar un ciclo para asegurar que newOrder está actualizado
    setTimeout(async () => {
      const orderIds = newOrder.map(s => s.id);
     
      await api.put(ENDPOINTS.SERVICES.ORDER_LIST, { orderIds });
     
      await fetchServices();
      setError(null);
    }, 0);
    return { success: true };
  } catch (err) {
    console.error('[updateServiceOrder] Error al actualizar orden:', err);
    setError('Error al actualizar el orden de servicios');
    return { success: false, error: 'Error al actualizar el orden de servicios' };
  } finally {
    setLoading(false);
  }
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
    let payload: any = serviceData;
    let headers: any = {};
    let isFormData = false;

    // Si hay imagen y es File, usar FormData
    if (serviceData.image && serviceData.image instanceof File) {
      isFormData = true;
      const formData = new FormData();
      formData.append('file', serviceData.image);
      if (serviceData.name) formData.append('name', serviceData.name);
      if (serviceData.link) formData.append('link', serviceData.link);
      if (serviceData.description) formData.append('description', serviceData.description);
      payload = formData;
      headers['Content-Type'] = 'multipart/form-data';
      headers['Authorization'] = api.defaults.headers.common['Authorization'];
     
    } else {
      // JSON normal
      headers['Content-Type'] = 'application/json';
      headers['Authorization'] = api.defaults.headers.common['Authorization'];

    }

    const response = await api.patch<Service>(
      `${ENDPOINTS.SERVICES.LIST}/${id}`,
      payload,
      { headers, ...(isFormData ? { transformRequest: [(data: any) => data] } : {}) }
    );
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

  // Cache para evitar peticiones repetidas al backend
  const serviceRequestCache: Record<number, {
    timestamp: number;
    promise: Promise<Service | undefined>;
  }> = {};
  
  // Tiempo de vida del cache (5 segundos)
  const CACHE_TTL = 5000;


  const getServiceById = async (id: number, forceRefresh: boolean = false): Promise<Service | undefined> => {
    // Primero intentamos encontrar el servicio en el array local (cache)
    const cachedService = services.find(service => service.id === id);
    
    // Si lo encontramos en cache y no se fuerza refresh, lo devolvemos
    if (cachedService && !forceRefresh) {
    
      return cachedService;
    }
    
    // Verificamos si ya hay una petición en curso para este ID
    const now = Date.now();
    const cachedRequest = serviceRequestCache[id];
    
    if (cachedRequest && now - cachedRequest.timestamp < CACHE_TTL && !forceRefresh) {
    
      return cachedRequest.promise;
    }

    // Creamos la promesa para la petición
    const fetchPromise = (async () => {
      try {
        const response = await api.get<Service>(`${ENDPOINTS.SERVICES.LIST}/${id}`);

        // Actualizamos el array local con el servicio obtenido
        setServices(prevServices => {
          // Si el servicio ya existe en el array, lo actualizamos
          const index = prevServices.findIndex(s => s.id === id);
          if (index !== -1) {
            const updatedServices = [...prevServices];
            updatedServices[index] = response.data;
            return updatedServices;
          }
          // Si no existe, lo añadimos
          return [...prevServices, response.data];
        });
        
        return response.data;
      } catch (error) {
        console.error(`[getServiceById] Error al obtener servicio ${id}:`, error);
        return undefined;
      } finally {
        // Limpiamos el cache después del tiempo de vida
        setTimeout(() => {
          delete serviceRequestCache[id];
        }, CACHE_TTL);
      }
    })();
    
    // Guardamos la promesa en el cache
    serviceRequestCache[id] = {
      timestamp: now,
      promise: fetchPromise
    };
    
    return fetchPromise;
  };

  const deleteService = async (id: number) => {
  try {
   
    await api.delete(`${ENDPOINTS.SERVICES.LIST}/${id}`);
    
    await fetchServices();
    return { success: true };
  } catch (err) {
   
    setError('Error al eliminar el servicio');
    return { success: false, error: 'Error al eliminar el servicio' };
  }
};  

  const updateParams = (newParams: Partial<ServiceParams>) => {
    setParams(prev => ({
      ...prev,
      ...newParams
    }));
  };

  return {
    services,
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

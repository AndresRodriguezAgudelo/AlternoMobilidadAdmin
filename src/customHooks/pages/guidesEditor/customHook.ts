import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';

export interface CategoryOption { label: string; value: string; }

export interface GuideFormData {
  title: string;
  category: string;
  file: File | null; // Puede ser File o null (archivo vacío para eliminar)
  fileSecondary: File | null;
  fileTertiary: File | null;
  description: string;
  keyMain: string;
  keySecondary: string;
  keyTertiary: string;
  data?: {
    mainImageUrl?: string;
    secondaryImageUrl?: string;
    tertiaryVideoUrl?: string;
  };
  typeDeleted?: Array<'file' | 'fileSecondary' | 'fileTertiary'>;
}

export const useGuideEditor = () => {
  const { id } = useParams<{ id: string }>();
  const guideId = id ? parseInt(id) : undefined;
  const navigate = useNavigate();
  const isEditing = !!guideId;

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [formData, setFormData] = useState<GuideFormData>({
    title: '',
    category: '',
    file: null,
    fileSecondary: null,
    fileTertiary: null,
    description: '',
    keyMain: '',
    keySecondary: '',
    keyTertiary: '',
    typeDeleted: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from server
  const fetchCategories = async () => {
    try {
      const { data } = await api.get(ENDPOINTS.CATEGORIES.LIST, { params: { order: 'ASC', page: 1, take: 50 } });
      const opts = data.data.map((cat: any) => ({ label: cat.categoryName, value: String(cat.id) }));
      setCategoryOptions(opts);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    if (!isEditing || !guideId) return;
    setLoading(true);
    setError(null);
    api.get(ENDPOINTS.GUIDES.DETAIL(guideId))
      .then(({ data: responseData }) => {
        // Registrar la respuesta para depuración
        
        setFormData({
          title: responseData.name || '',
          category: String(responseData.categoryId || ''),
          file: null,
          fileSecondary: null,
          fileTertiary: null,
          description: responseData.description || '',
          keyMain: responseData.keyMain || '',
          keySecondary: responseData.keySecondary || '',
          keyTertiary: responseData.keyTertiary || '',
          // Incluir la propiedad data si existe en la respuesta
          data: responseData.data ? {
            mainImageUrl: responseData.data.mainImageUrl,
            secondaryImageUrl: responseData.data.secondaryImageUrl,
            tertiaryVideoUrl: responseData.data.tertiaryVideoUrl
          } : undefined,
          typeDeleted: []
        });
      })
      .catch(() => {
        setError('No se pudo cargar la guía.');
      })
      .finally(() => setLoading(false));
  }, [guideId]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      
      const fd = new FormData();
      fd.append('name', formData.title);
      fd.append('description', formData.description);
      fd.append('categoryId', formData.category);
      
      // Agregar typeDeleted SOLO si estamos editando y si existe y tiene elementos
      if (isEditing && formData.typeDeleted && formData.typeDeleted.length > 0) {
        // Filtrar typeDeleted para eliminar los tipos que tienen archivos asociados
        const filteredTypeDeleted = formData.typeDeleted.filter(type => {
          // Si hay un archivo para este tipo, no lo incluimos en typeDeleted
          if (type === 'file' && formData.file && !(formData.file.size === 0 && formData.file.name === '')) {
            return false;
          }
          if (type === 'fileSecondary' && formData.fileSecondary && !(formData.fileSecondary.size === 0 && formData.fileSecondary.name === '')) {
            return false;
          }
          if (type === 'fileTertiary' && formData.fileTertiary && !(formData.fileTertiary.size === 0 && formData.fileTertiary.name === '')) {
            return false;
          }
          return true;
        });
        
        // Solo agregar typeDeleted si quedan elementos después de filtrar
        if (filteredTypeDeleted.length > 0) {
          // Convertir el array a JSON string para enviarlo
          fd.append('typeDeleted', JSON.stringify(filteredTypeDeleted));
        }
      }
      
      // Para la imagen principal
      if (formData.file instanceof File) {
        // Verificar si es un archivo vacío (para eliminar)
        if (formData.file.size === 0 && formData.file.name === '') {
          // Si es un archivo vacío, lo enviamos para indicar eliminación
          fd.append('file', formData.file);
          // Agregar a typeDeleted si no está ya incluido
          if (formData.typeDeleted && !formData.typeDeleted.includes('file')) {
            formData.typeDeleted.push('file');
          }
        } else {
          // Si es un archivo normal, lo agregamos
          fd.append('file', formData.file);
          
        }
      } else if (formData.file === null) {
      }
      
      // Para el archivo secundario
      if (formData.fileSecondary instanceof File) {
        // Verificar si es un archivo vacío (para eliminar)
        if (formData.fileSecondary.size === 0 && formData.fileSecondary.name === '') {
          // Si es un archivo vacío, lo enviamos para indicar eliminación
          fd.append('fileSecondary', formData.fileSecondary);
          // Agregar a typeDeleted si no está ya incluido
          if (formData.typeDeleted && !formData.typeDeleted.includes('fileSecondary')) {
            formData.typeDeleted.push('fileSecondary');
          }
        } else {
          // Si es un archivo normal, lo agregamos
          fd.append('fileSecondary', formData.fileSecondary);
          
        }
      } 
      
      // Para el archivo terciario
      if (formData.fileTertiary instanceof File) {
        // Verificar si es un archivo vacío (para eliminar)
        if (formData.fileTertiary.size === 0 && formData.fileTertiary.name === '') {
          // Si es un archivo vacío, lo enviamos para indicar eliminación
          fd.append('fileTertiary', formData.fileTertiary);
          // Agregar a typeDeleted si no está ya incluido
          if (formData.typeDeleted && !formData.typeDeleted.includes('fileTertiary')) {
            formData.typeDeleted.push('fileTertiary');
          }
        } else {
          // Si es un archivo normal, lo agregamos
          fd.append('fileTertiary', formData.fileTertiary);
        }
      }
      
      for (const pair of fd.entries()) {
        if (pair[1] instanceof File) {
        } 
      }

      
      if (isEditing && guideId) {
      
        await api.patch(ENDPOINTS.GUIDES.DETAIL(guideId), fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: [(data) => {
            return data;
          }],
        });
      } else {
        await api.post(ENDPOINTS.GUIDES.LIST, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          transformRequest: [(data) => {
         
            return data;
          }],
        });
      }
      navigate('/guias');
    } catch (err: any) {
      setError(isEditing ? 'Error al actualizar la guía' : 'Error al crear la guía');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof GuideFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Función específica para manejar la eliminación de archivos
  const handleFileDelete = (fileType: 'file' | 'fileSecondary' | 'fileTertiary') => {
    // Crear un archivo vacío para indicar eliminación
    const emptyFile = new File([], '', { type: 'application/octet-stream' });
    
    // Actualizar el formData con el archivo vacío y agregar a typeDeleted
    setFormData(prev => {
      // Crear una copia del array typeDeleted o inicializarlo si no existe
      const updatedTypeDeleted = prev.typeDeleted ? [...prev.typeDeleted] : [];
      
      // Agregar el tipo de archivo a eliminar si no está ya incluido
      if (!updatedTypeDeleted.includes(fileType)) {
        updatedTypeDeleted.push(fileType);
      }
      // Retornar el formData actualizado
      return {
        ...prev,
        [fileType]: emptyFile,  // Asignar archivo vacío
        typeDeleted: updatedTypeDeleted
      };
    });
  };

  const handleBack = () => navigate('/guias');

  return {
    formData,
    categoryOptions,
    loading,
    error,
    isEditing,
    handleSubmit,
    handleFieldChange,
    handleFileDelete,  // Exportar la nueva función
    handleBack,
    fetchCategories,
  };
};

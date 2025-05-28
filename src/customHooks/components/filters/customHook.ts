import { useState } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';

interface UseDownloadReportParams {
  module: string;
  currentPage: number;
  specificModule?: string;
}

interface DownloadReportParams {
  [key: string]: any;
}

export const useDownloadReport = ({ module, currentPage, specificModule }: UseDownloadReportParams) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadReport = async (filters: DownloadReportParams = {}) => {
    try {
      setIsDownloading(true);
      setError(null);

      const url = ENDPOINTS.REPORTS.DOWNLOAD(module);
      let response;
      if (module === 'queries') {
        // Botón descarga Excel: GET puro sin parámetros
        response = await api.get(url, { responseType: 'blob' });
      } else {
        // GET con paginación, orden y filtros para otros módulos
        const params: Record<string, any> = { page: currentPage, take: 10, order: 'ASC', ...filters };
        
        // Agregar el parámetro de búsqueda si se proporciona specificSearch
        if (specificModule) {
          params.module = specificModule;
        } else if (module === 'payments') {
          // Valor por defecto para el módulo de pagos
          params.module = 'Link de pago';
        }

        
        response = await api.get(url, { params, responseType: 'blob' });
      }

      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `${module}-report.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al descargar el reporte';
      setError(errorMessage);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadReport,
    isDownloading,
    error
  };
};

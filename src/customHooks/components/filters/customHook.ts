import { useState } from 'react';
import { api } from '../../../services/api';
import { ENDPOINTS } from '../../../services/endPoints';

interface UseDownloadReportParams {
  module: string;
  currentPage: number;
}

interface DownloadReportParams {
  search?: string;
  order?: 'ASC' | 'DESC';
}

export const useDownloadReport = ({ module, currentPage }: UseDownloadReportParams) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadReport = async ({ search = '', order = 'ASC' }: DownloadReportParams = {}) => {
    try {
      setIsDownloading(true);
      setError(null);

      
      const response = await api.get(ENDPOINTS.REPORTS.DOWNLOAD(module), {
        params: {
          search,
          order,
          page: currentPage,
          take: 10
        },
        responseType: 'blob'
      });

      // Crear un blob y descargar el archivo
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
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

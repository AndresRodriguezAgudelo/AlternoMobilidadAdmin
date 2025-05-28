import { useState } from 'react';
import { TitleSearch } from '../../components/titleSearch';
import { Filters } from '../../components/filters';
import { Table } from '../../components/table';
import { usePaymentData, paymentTableHeaders } from '../../customHooks/pages/payments/customHook';
import { useDownloadReport } from '../../customHooks/components/filters/customHook';
import { FilterOption } from '../../types/filters';
import './styled.css';

const filterOptions: FilterOption[] = [
  {
    label: 'Desde',
    type: 'date',
    header: 'startDate'
  },
  {
    label: 'Hasta',
    type: 'date',
    header: 'endDate'
  }
];

const Payments = () => {
  const { payments, fetchPayments, loading, meta, handleSort, sortKey, sortOrder } = usePaymentData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { downloadReport, isDownloading } = useDownloadReport({ module: 'payments', currentPage: 1, specificModule: 'Link de pago' });

  // Llama a fetchPayments cuando se aplican filtros o búsqueda
  const handleApplyFilters = (filterValues: Record<string, any>) => {
    setFilters(filterValues);
    fetchPayments(
      1, // página
      50, // tamaño de página (ajusta si usas otro)
      'ASC', // orden
      searchTerm, // término de búsqueda (opcional)
      filterValues.startDate,
      filterValues.endDate
    );
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Aplica búsqueda junto con los filtros actuales
    fetchPayments(
      1,
      50,
      'DESC',
      value, 
      filters.startDate,
      filters.endDate
    );
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    setFilters(filterValues);
  };

  // Manejador para cambio de página
  const handlePageChange = (page: number) => {
    fetchPayments(
      page,
      50,
      'DESC',
      searchTerm, // Ya no necesitamos el fallback 'Link de pago' porque ahora usamos modules
      filters.startDate,
      filters.endDate
    );
  };

  return (
    <div className="payments-container">
      <TitleSearch 
      progressScreen={false} 
      label="Gestión de pagos" 
      onSearch={handleSearch} 
      placeholderSearchInput="Buscar click por ID, usuario..."
      subTitle="Solo se registran los clics en la sección de pagos, no las transacciones realizadas"
      />
      <Filters 
        filters={filterOptions} 
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onDownload={downloadReport} 
        isDownloading={isDownloading} 
      />
      <Table 
        headers={paymentTableHeaders} 
        data={payments} 
        loading={loading}
        customRenderers={{
          user: (user: any) => user?.name || 'N/A',
          createdAt: (date: string) => {
            const d = new Date(date);
            return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
          }
        }}
        pagination={{
          page: meta?.page ? parseInt(meta.page) : 1,
          pageSize: meta?.take ? parseInt(meta.take) : 50,
          total: meta?.total || 0,
          onChange: handlePageChange
        }}
        onSort={handleSort}
        currentSortKey={sortKey}
        currentSortOrder={sortOrder}
      />
    </div>
  );
};

export default Payments;

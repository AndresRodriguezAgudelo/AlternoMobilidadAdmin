import { useState, useEffect } from 'react';
import { TitleSearch } from '../../components/titleSearch';
import { Filters } from '../../components/filters';
import { Table } from '../../components/table';
import { useQueries, queryTableHeaders, customRenderers } from '../../customHooks/pages/queries/customHook';
import { FilterOption } from '../../types/filters';
import './styled.css';

const getFilterOptions = (modules: string[]): FilterOption[] => [
  {
    label: 'Desde',
    type: 'date',
    header: 'startDate'
  },
  {
    label: 'Hasta',
    type: 'date',
    header: 'endDate'
  },
  {
    label: 'Módulo',
    type: 'select',
    options: modules,
    header: 'module'
  }
];

const Queries = () => {
  const { queries, loading, error, meta, uniqueModules, setParams, filterQueries } = useQueries();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  console.log(filters);

  // Este efecto solo maneja la búsqueda por texto
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setParams(prev => ({
        ...prev,
        page: 1,
        search: searchTerm
      }));
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Inicializar parámetros base
  useEffect(() => {
    setParams({
      page: 1,
      take: 10,
      order: 'ASC'
    });
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    // Almacenamos los valores para usarlos cuando se apliquen los filtros
    setFilters(filterValues);
  };

  const handleApplyFilters = (formattedFilters: Record<string, any>) => {
    console.log('Filtros recibidos en Queries:', formattedFilters);
    // Aplicar filtros localmente
    filterQueries(formattedFilters);
  };

  const handlePageChange = (page: number) => {
    setParams(prev => ({
      ...prev,
      page
    }));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="queries-container">
      <div className="queries-header">
        <TitleSearch
        progressScreen={false} 
        label="Gestion de consultas" 
        onSearch={handleSearch} 
        />
      </div>

      <div className="queries-filters">
        <Filters
        filters={getFilterOptions(uniqueModules)} 
        onChange={handleFilterChange}
          onApply={handleApplyFilters}
        />
      </div>

      <div className="queries-table">
        <Table
          data={queries}
          headers={queryTableHeaders}
          customRenderers={customRenderers}
          loading={loading}
          pagination={{
          page: meta?.page ? parseInt(meta.page) : 1,
          pageSize: meta?.take ? parseInt(meta.take) : 10,
          total: meta?.total || 0,
          onChange: handlePageChange
          }}
        />
      </div>
    </div>
  );
};

export default Queries;

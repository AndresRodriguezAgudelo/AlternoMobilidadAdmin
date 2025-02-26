import { useState, useEffect } from 'react';
import { TitleSearch } from '../../components/titleSearch';
import { Filters } from '../../components/filters';
import { Table } from '../../components/table';
import { useQueries, queryTableHeaders, customRenderers } from '../../customHooks/pages/queries/customHook';
import './styled.css';

type FilterOption = {
  label: string;
  type: 'date' | 'select';
  options?: string[];
};

const filterOptions: FilterOption[] = [
  {
    label: 'Desde',
    type: 'date'
  },
  {
    label: 'Hasta',
    type: 'date'
  }
];

const Queries = () => {
  const { queries, loading, error, meta, setParams } = useQueries();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setParams({
        page: 1,
        take: 10,
        search: searchTerm,
        startDate: filters.Desde,
        endDate: filters.Hasta
      });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    setFilters(filterValues);
  };

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="queries-container">
      <TitleSearch 
        progressScreen={false} 
        label="Gestion de consultas" 
        onSearch={handleSearch} 
      />
      <Filters 
        filters={filterOptions} 
        onChange={handleFilterChange} 
      />
      <Table 
        headers={queryTableHeaders} 
        data={queries} 
        loading={loading}
        customRenderers={customRenderers}
        pagination={{
          page: meta?.page ? parseInt(meta.page) : 1,
          pageSize: meta?.take ? parseInt(meta.take) : 10,
          total: meta?.total || 0,
          onChange: handlePageChange
        }}
      />
    </div>
  );
};

export default Queries;

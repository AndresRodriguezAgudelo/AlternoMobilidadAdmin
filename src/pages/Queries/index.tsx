import { useState, useMemo } from 'react';
import { TitleSearch } from '../../components/titleSearch';
import { Filters } from '../../components/filters';
import { Table } from '../../components/table';
import { useQueryData, queryTableHeaders } from '../../customHooks/pages/queries/customHook';
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
  },
  {
    label: 'Módulo de Consulta',
    type: 'select',
    options: ['Usuarios', 'Vehículos', 'Reservas', 'Pagos', 'Mantenimiento', 'Reportes', 'Incidencias', 'Configuración']
  }
];

const Queries = () => {
  const { queries } = useQueryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredQueries = useMemo(() => {
    return queries.filter(query => {
      // Filtro por búsqueda
      if (searchTerm && !query.consulta.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por fechas
      const queryDate = query.fConsulta.split('/').reverse().join('-');
      if (filters.Desde && queryDate < filters.Desde) {
        return false;
      }
      if (filters.Hasta && queryDate > filters.Hasta) {
        return false;
      }

      // Filtro por módulo
      if (filters['Módulo de Consulta'] && query.moduloConsulta !== filters['Módulo de Consulta']) {
        return false;
      }

      return true;
    });
  }, [queries, searchTerm, filters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    setFilters(filterValues);
  };

  return (
    <div className="queries-container">
      <TitleSearch progressScreen={false} label="Gestión de consultas" onSearch={handleSearch} />
      <Filters filters={filterOptions} onChange={handleFilterChange} />
      <Table headers={queryTableHeaders} data={filteredQueries} />
    </div>
  );
};

export default Queries;

import { useState } from 'react';
import { FileDownload } from '@mui/icons-material';
import { InputDate } from '../inputs/inputDate';
import { InputSelect } from '../inputs/inputSelect';
import { Button } from '../buttons/simpleButton';
import { IconButton } from '../buttons/iconButton';
import './styled.css';

interface FilterOption {
  label: string;
  type: 'date' | 'select';
  options?: string[];
}

interface FiltersProps {
  filters: FilterOption[];
  onChange: (filterValues: Record<string, any>) => void;
}

export const Filters = ({ filters, onChange }: FiltersProps) => {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleFilterChange = (label: string, value: any) => {
    const newValues = {
      ...filterValues,
      [label]: value
    };
    setFilterValues(newValues);
  };

  const handleApplyFilters = () => {
    onChange(filterValues);
  };

  const handleDownload = () => {
    console.log('descargar funcionalidad');
  };

  return (
    <div className="filters-container">
      <div className="filters-label">Filtros de búsqueda</div>
      <div className="filters-content">
        <div className="filters-group">
          {filters.map((filter) => (
            <div key={filter.label} className="filter-item">
              {filter.type === 'date' ? (
                <InputDate
                  label={filter.label}
                  value={filterValues[filter.label] || ''}
                  onChange={(value) => handleFilterChange(filter.label, value)}
                />
              ) : (
                <InputSelect
                  label={filter.label}
                  value={filterValues[filter.label] || ''}
                  options={filter.options || []}
                  onChange={(value) => handleFilterChange(filter.label, value)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="filters-actions">
          <Button
            label="Filtrar"
            onClick={handleApplyFilters}
          />
          <IconButton
            Icon={FileDownload}
            onClick={handleDownload}
            title="Descargar PDF"
          />
        </div>
      </div>
    </div>
  );
};

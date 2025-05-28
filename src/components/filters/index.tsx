import { useState, ReactNode } from 'react';
import { FileDownload } from '@mui/icons-material';
import { InputDate } from '../inputs/inputDate';
import { Button } from '../buttons/simpleButton';
import { IconButton } from '../buttons/iconButton';
import { FilterOption } from '../../types/filters';
import './styled.css';
import { InputSelectDropdown } from '../inputs/inputSelectDropdown';

interface FiltersProps {
  filters: FilterOption[];
  onChange: (filterValues: Record<string, any>) => void;
  onApply?: (formattedFilters: Record<string, any>) => void;
  moduleType?: string;
  currentPage?: number;
  onDownload?: (filters: Record<string, any>) => void;
  isDownloading?: boolean;
  customFilterElement?: ReactNode;
}

export const Filters = ({
  filters,
  onChange,
  onApply,
  onDownload,
  isDownloading = false,
  customFilterElement
}: FiltersProps) => {
  // Almacena los valores actuales de los filtros
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handleFilterChange = (label: string, value: any) => {
    const newValues = {
      ...filterValues,
      [label]: value
    };
    setFilterValues(newValues);
    onChange(newValues);
  };


  const handleApplyFilters = () => {
    // Crear objeto con estructura {header: value}
    const formattedFilters = filters.reduce((acumulador, filter) => {
      if (filterValues[filter.label]) {
        acumulador[filter.header] = filterValues[filter.label];
      }
      return acumulador;
    }, {} as Record<string, any>);
    if (onApply) {
      onApply(formattedFilters);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      // Crear objeto con estructura {header: value} igual que en handleApplyFilters
      const formattedFilters = filters.reduce((acumulador, filter) => {
        if (filterValues[filter.label]) {
          acumulador[filter.header] = filterValues[filter.label];
        }
        return acumulador;
      }, {} as Record<string, any>);
      onDownload(formattedFilters);
    }
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
                <InputSelectDropdown
                  label={filter.label}
                  value={filterValues[filter.label] || ''}
                  options={(filter.options || []).map(option => ({ label: option, value: option }))}
                  onChange={(value) => handleFilterChange(filter.label, value)}
                />
              )}
            </div>
          ))}
          {customFilterElement && (
            <div className="filter-item">
              {customFilterElement}
            </div>
          )}
        </div>
        <div className="filters-actions">
          <Button
            label="Filtrar"
            onClick={handleApplyFilters}
          />
          <IconButton
            Icon={FileDownload}
            onClick={handleDownload}
            title="Descargar Excel"
            loading={isDownloading}
          />
        </div>
      </div>
    </div>
  );
};

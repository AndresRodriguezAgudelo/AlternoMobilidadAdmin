import React, { useState, useMemo } from 'react';
import { Modal } from '../modal';
import { UserVehicle } from '../../types/user';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './styles.css';

interface VehiclesModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: UserVehicle[];
}

const tableHeaders = [
  { key: 'licensePlate', label: 'Placa' },
  { key: 'typeDocument', label: 'Tipo de documento' },
  { key: 'numberDocument', label: 'Documento' },
  { key: 'dateRegister', label: 'F. Registro', sortable: true },
];

export const VehiclesModal: React.FC<VehiclesModalProps> = ({
  isOpen,
  onClose,
  vehicles,
}) => {
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const handleSort = () => {
    setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
  };

  const sortedVehicles = useMemo(() => {
    return [...vehicles].sort((a, b) => {
      const dateA = a.vehicle.dateRegister ? new Date(a.vehicle.dateRegister).getTime() : 0;
      const dateB = b.vehicle.dateRegister ? new Date(b.vehicle.dateRegister).getTime() : 0;
      
      return sortOrder === 'ASC' ? dateA - dateB : dateB - dateA;
    });
  }, [vehicles, sortOrder]);
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=''
    >
      <div className="vehicles-table">
        <div className="table-header">
          {tableHeaders.map(header => (
            <div 
              key={header.key} 
              className={`header-cell ${header.sortable ? 'sortable-header' : ''}`}
              onClick={header.sortable ? handleSort : undefined}
              role='button'
            >
              <div className="header-content">
                {header.label}
                {header.sortable && (
                  <span className="sort-icon">
                    {sortOrder === 'ASC' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="table-body">
          {sortedVehicles.length === 0 ? (
            <div className="no-vehicles">No hay vehículos registrados</div>
          ) : (
            sortedVehicles.map((userVehicle) => (
              <div key={userVehicle.id} className="table-row">
                <div className="table-cell">{userVehicle.vehicle.licensePlate}</div>
                <div className="table-cell">{userVehicle.vehicle.typeDocument.typeName}</div>
                <div className="table-cell">{userVehicle.vehicle.numberDocument}</div>
                {/* TODO: cambiar registro a nueva estructura */}
                <div className="table-cell">{formatDate(userVehicle.vehicle.dateRegister)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

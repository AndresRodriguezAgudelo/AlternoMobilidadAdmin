import React from 'react';
import { Modal } from '../modal';
import { UserVehicle } from '../../types/user';
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
  { key: 'dateRegister', label: 'F. Registro' },
];

export const VehiclesModal: React.FC<VehiclesModalProps> = ({
  isOpen,
  onClose,
  vehicles,
}) => {
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
            <div key={header.key} className="header-cell">
              {header.label}
            </div>
          ))}
        </div>
        <div className="table-body">
          {vehicles.length === 0 ? (
            <div className="no-vehicles">No hay vehículos registrados</div>
          ) : (
            vehicles.map((userVehicle) => (
              <div key={userVehicle.id} className="table-row">
                <div className="table-cell">{userVehicle.vehicle.licensePlate}</div>
                <div className="table-cell">{userVehicle.vehicle.typeDocument.typeName}</div>
                <div className="table-cell">{userVehicle.vehicle.numberDocument}</div>
                <div className="table-cell">{formatDate(userVehicle.vehicle.dateRegister)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

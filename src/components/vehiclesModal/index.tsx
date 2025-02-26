import React from 'react';
import { Modal } from '../modal';
import { UserVehicle } from '../../types/user';
import './styles.css';

interface VehiclesModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: UserVehicle[];
  userName: string;
}

export const VehiclesModal: React.FC<VehiclesModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  userName
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vehículos de ${userName}`}
    >
      <div className="vehicles-list">
        {vehicles.map((userVehicle) => (
          <div key={userVehicle.id} className="vehicle-card">
            <div className="vehicle-info">
              <div className="info-row">
                <span className="label">Placa:</span>
                <span className="value">{userVehicle.vehicle.licensePlate}</span>
              </div>
              <div className="info-row">
                <span className="label">Documento:</span>
                <span className="value">
                  {userVehicle.vehicle.typeDocument.typeName} {userVehicle.vehicle.numberDocument}
                </span>
              </div>
              {userVehicle.vehicle.dateRegister && (
                <div className="info-row">
                  <span className="label">Fecha de Registro:</span>
                  <span className="value">{userVehicle.vehicle.dateRegister}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <p className="no-vehicles">Este usuario no tiene vehículos registrados.</p>
        )}
      </div>
    </Modal>
  );
};

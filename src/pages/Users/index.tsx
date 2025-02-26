import { useState } from 'react';
import { TitleSearch } from '../../components/titleSearch';
import { Filters } from '../../components/filters';
import { Table } from '../../components/table';
import { useUserData, userTableHeaders } from '../../customHooks/pages/user/customHook';
import { VehiclesModal } from '../../components/vehiclesModal';
import { User } from '../../types/user';
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
    label: 'Vehículos',
    type: 'select',
    options: ['1', '2', '3', '4', '5']
  },
  {
    label: 'Estado',
    type: 'select',
    options: ['true', 'false']
  },
];

const Users = () => {
  const { users, loading, error, meta, setParams } = useUserData();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (value: string) => {
    setParams(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    setParams(prev => ({
      ...prev,
      page: 1,
      startDate: filterValues.Desde || undefined,
      endDate: filterValues.Hasta || undefined,
      totalVehicles: filterValues.Vehículos ? parseInt(filterValues.Vehículos) : undefined,
      accepted: filterValues.Estado ? filterValues.Estado === 'true' : undefined
    }));
  };

  const handleCellClick = (row: any, column: string) => {
    if (column === 'userVehicles') {
      setSelectedUser(row);
      setIsModalOpen(true);
    }
  };

  const renderVehicleCount = (vehicles: any[]) => {
    return (
      <button 
        className="vehicle-count-button"
        onClick={(e) => e.stopPropagation()}
      >
        {vehicles.length} vehículo(s)
      </button>
    );
  };

  const renderStatus = (accepted: boolean) => {
    return (
      <span className={`status-indicator ${accepted ? 'active' : 'inactive'}`}>
        {accepted ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const customRenderers = {
    userVehicles: renderVehicleCount,
    accepted: renderStatus
  };

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="users-container">
      <TitleSearch 
        progressScreen={false} 
        label="Gestión de Usuarios" 
        onSearch={handleSearch} 
      />
      <Filters 
        filters={filterOptions} 
        onChange={handleFilterChange} 
      />
      <Table 
        headers={userTableHeaders} 
        data={users} 
        loading={loading}
        onCellClick={handleCellClick}
        customRenderers={customRenderers}
        pagination={{
          page: meta?.page ? parseInt(meta.page) : 1,
          pageSize: meta?.take ? parseInt(meta.take) : 10,
          total: meta?.total || 0,
          onChange: handlePageChange
        }}
      />
      {selectedUser && (
        <VehiclesModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          vehicles={selectedUser.userVehicles}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
};

export default Users;

import { useState } from 'react';
import { TitleSearch } from '../../components/titleSearch';
import { Filters } from '../../components/filters';
import { Table } from '../../components/table';
import { useUserData, userTableHeaders } from '../../customHooks/pages/user/customHook';
import { VehiclesModal } from '../../components/vehiclesModal';
import { SwitchInput } from '../../components/inputs/inputSwitch';
import { VerifyIcon } from '../../components/verifyIcon';
import { useDownloadReport } from '../../customHooks/components/filters/customHook';
import { User } from '../../types/user';
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
  },
  {
    header: 'vehicles',
    label: 'Vehículos',
    type: 'select',
    options: [
      'Todo',
      '1 Vehiculo',
      '2 Vehiculos'
    ],
  },
  {
    header: 'estado',
    label: 'Estado',
    type: 'select',
    options: [
      'Todos',
      'Activos',
      'Inactivos'
    ],
  }
];

const Users = () => {
  const { users, loading, error, meta, updateUserStatus, fetchUsers } = useUserData();
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { downloadReport, isDownloading } = useDownloadReport({
    module: 'users',
    currentPage: meta?.page ? parseInt(meta.page) : 1
  });

  const handleSearch = (value: string) => {
    const newFilters = { ...currentFilters, search: value };
    setCurrentFilters(newFilters);
    applyFiltersAndFetch(newFilters, 1);
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    // Este método solo se usa para mantener el estado de los filtros
    console.log('Cambio en filtros:', filterValues);
  };

  const applyFiltersAndFetch = (filterValues: Record<string, any>, page: number) => {
    console.log('Aplicando filtros:', filterValues);
    
    const totalVehicles = filterValues.vehicles === '1 Vehiculo' ? 1 : 
                         filterValues.vehicles === '2 Vehiculos' ? 2 : undefined;

    const status = filterValues.estado === 'Activos' ? true :
                  filterValues.estado === 'Inactivos' ? false : undefined;

    fetchUsers(
      page,
      10,
      'ASC',
      filterValues.search,
      filterValues.startDate,
      filterValues.endDate,
      totalVehicles,
      status
    );
  };

  const handleApplyFilters = (filterValues: Record<string, any>) => {
    setCurrentFilters(filterValues);
    applyFiltersAndFetch(filterValues, 1);
  };



  const renderVehicleCount = (vehicles: any[], row: User) => {
    return (
      <div className="vehicle-info">
        <span className="vehicle-count-button">
          {vehicles.length}
        </span>
        <span 
          className="vehicle-count-label"
          onClick={() => {
            setSelectedUser(row);
            setIsModalOpen(true);
          }}
        >
          Ver detalle
        </span>
      </div>
    );
  };

  const renderStatus = (value: boolean, row: User) => {
    return (
      <SwitchInput 
        value={value}
        onChange={async (newValue) => {
          await updateUserStatus(row.id, newValue);
        }}
      />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderEmail = (email: string, row: User) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {email}
        <VerifyIcon verified={row.verify} />
      </div>
    );
  };

  const customRenderers = {
    userVehicles: renderVehicleCount,
    status: renderStatus,
    createdAt: formatDate,
    email: renderEmail
  };

  const handlePageChange = (page: number) => {
    applyFiltersAndFetch(currentFilters, page);
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
        onApply={handleApplyFilters}
        onDownload={downloadReport}
        isDownloading={isDownloading}
      />
      <Table 
        headers={userTableHeaders} 
        data={users} 
        loading={loading}

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
        />
      )}
    </div>
  );
};

export default Users;

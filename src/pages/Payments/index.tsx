import { useState, useMemo } from 'react';
import { TitleSearch } from '../../components/titleSearch';
import { Filters } from '../../components/filters';
import { Table } from '../../components/table';
import { usePaymentData, paymentTableHeaders } from '../../customHooks/pages/payments/customHook';
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
  }
];

const Payments = () => {
  const { payments } = usePaymentData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      // Filtro por búsqueda
      if (searchTerm && !payment.usuario.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por fechas
      const paymentDate = payment.fechaClic.split('/').reverse().join('-');
      if (filters.startDate && paymentDate < filters.startDate) {
        return false;
      }
      if (filters.endDate && paymentDate > filters.endDate) {
        return false;
      }

      return true;
    });
  }, [payments, searchTerm, filters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterValues: Record<string, any>) => {
    setFilters(filterValues);
  };

  return (
    <div className="payments-container">
      <TitleSearch progressScreen={false} label="Gestión de pagos" onSearch={handleSearch} />





      <Filters 

          filters={filterOptions} 
          onChange={handleFilterChange} 

          
      />










      <Table headers={paymentTableHeaders} data={filteredPayments} />
    </div>
  );
};

export default Payments;

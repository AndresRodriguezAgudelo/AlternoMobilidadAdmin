import { TitleSearch } from '../../components/titleSearch';
import { Filters } from '../../components/filters';
import { Table } from '../../components/table';
import { useQueries, queryTableHeaders, customRenderers } from '../../customHooks/pages/queries/customHook';
import { FilterOption } from '../../types/filters';
import { InputSelectDropdownSimple } from '../../components/inputs/inputSelectDropdownSimple';
import './styled.css';

const getFilterOptions = (): FilterOption[] => [
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

const Queries = () => {
  const {
    queries,
    loading,
    error,
    meta,
    modulesList,
    selectedModule,
    isDownloading,
    setSelectedModule,
    downloadQueriesReport,
    handleSearch,
    handleFilterChange,
    handleApplyFilters,
    handlePageChange,
    handleSort,
    sortKey,
    sortOrder
  } = useQueries();


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="queries-container">
      <div className="queries-header">
        <TitleSearch
          progressScreen={false}
          label="Gestion de consultas"
          onSearch={handleSearch}
          placeholderSearchInput="Buscar consulta por ID, usuarios consultantes..."
        />
      </div>
      <div className="queries-filters">
        <Filters
          filters={getFilterOptions()}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          onDownload={downloadQueriesReport}
          isDownloading={isDownloading}
          customFilterElement={
            <InputSelectDropdownSimple
              label="Módulos"
              options={modulesList}
              value={selectedModule}
              onChange={setSelectedModule}
            />
          }
        />
      </div>
      <div className="queries-table">
        <Table
          data={queries}
          headers={queryTableHeaders}
          customRenderers={customRenderers}
          loading={loading}
          pagination={{
            page: meta?.page ? parseInt(meta.page) : 1,
            pageSize: meta?.take ? parseInt(meta.take) : 50,
            total: meta?.total || 0,
            onChange: handlePageChange
          }}
          onSort={handleSort}
          currentSortKey={sortKey}
          currentSortOrder={sortOrder}
        />
      </div>
    </div>
  );
};

export default Queries;

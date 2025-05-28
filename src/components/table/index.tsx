import { 
  Table as MuiTable, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  CircularProgress
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CancelIcon from '@mui/icons-material/Cancel';
import './styled.css';

interface TableHeader {
  key: string;
  label: string;
  isModal?: boolean;
  sortable?: boolean;
  sortKey?: string;
}

type CustomRenderer = (value: any, row?: any) => React.ReactNode;

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

interface TableProps {
  headers: TableHeader[];
  data: any[];
  loading?: boolean;
  onCellClick?: (row: any, column: string) => void;
  customRenderers?: Record<string, CustomRenderer>;
  pagination?: PaginationProps;
  onSort?: (key: string, order: 'ASC' | 'DESC') => void;
  currentSortKey?: string;
  currentSortOrder?: 'ASC' | 'DESC';
}

export const Table = ({ 
  headers, 
  data, 
  loading = false,
  onCellClick,
  customRenderers = {},
  pagination,
  onSort,
  currentSortKey = 'createdAt',
  currentSortOrder = 'DESC'
}: TableProps) => {
  const renderPagination = () => {
    if (!pagination) return null;

    const { page, pageSize, total, onChange } = pagination;
    const totalPages = Math.ceil(total / pageSize);

    // Calculamos el rango de registros mostrados
    const start = ((page - 1) * pageSize) + 1;
    const end = Math.min(page * pageSize, total);

    return (
      <div className="pagination-controls">
        <div>
          {start} - {end} de {total}
        </div>

        <div className='arrows-container'>

        <button 
          onClick={() => onChange(page - 1)}
          disabled={page <= 1 || loading}
          className="pagination-button"
        >
          <ArrowBackIosNewIcon />
        </button>
        <span className="pagination-info">
          Página {page} de {totalPages}
        </span>
        <button 
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages || loading}
          className="pagination-button"
        >
          <ArrowForwardIosIcon />
        </button>
        </div>
      </div>
    );
  };

  return (
    <div className="table-container">
      <TableContainer component={Paper}>
        <MuiTable>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell 
                  key={header.key} 
                  sx={{ fontWeight: 'bold' }}
                  onClick={() => {
                    if (header.sortable && onSort && header.sortKey) {
                      const newOrder = currentSortKey === header.sortKey && currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
                      onSort(header.sortKey, newOrder);
                    }
                  }}
                  className={header.sortable ? 'sortable-header' : ''}
                >
                  <div className="header-content">
                    {header.label}
                    {header.sortable && header.sortKey === currentSortKey && (
                      <span className="sort-icon">
                        {currentSortOrder === 'ASC' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                      </span>
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={headers.length} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} align="center">
                  <div className="no-results-container">
                    <div className="no-results-icon">
                      <CancelIcon sx={{ fontSize: 48, color: '#e05d38' }} />
                    </div>
                    <span className="no-results-text">
                      No se encontraron resultados para tu búsqueda. Intenta con otros términos
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell 
                      key={header.key}
                      onClick={() => onCellClick && header.isModal ? onCellClick(row, header.key) : undefined}
                      className={header.isModal ? 'clickable-cell' : ''}
                    >
                      {customRenderers[header.key] 
                        ? customRenderers[header.key](row[header.key], row)
                        : row[header.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {renderPagination()}
    </div>
  );
};

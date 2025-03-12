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
import './styled.css';

interface TableHeader {
  key: string;
  label: string;
  isModal?: boolean;
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
}

export const Table = ({ 
  headers, 
  data, 
  loading = false,
  onCellClick,
  customRenderers = {},
  pagination
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
                <TableCell key={header.key}>{header.label}</TableCell>
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
                  No hay datos disponibles
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

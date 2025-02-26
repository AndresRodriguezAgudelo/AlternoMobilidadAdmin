import { useState } from 'react';
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

type CustomRenderer = (value: any) => React.ReactNode;

interface TableProps {
  headers: TableHeader[];
  data: any[];
  itemsPerPage?: number;
  loading?: boolean;
  onCellClick?: (row: any, column: string) => void;
  customRenderers?: Record<string, CustomRenderer>;
}

export const Table = ({ 
  headers, 
  data, 
  itemsPerPage = 10,
  loading = false,
  onCellClick,
  customRenderers = {}
}: TableProps) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleCellClick = (row: any, column: string) => {
    if (onCellClick && headers.find(h => h.key === column)?.isModal) {
      onCellClick(row, column);
    }
  };

  if (loading) {
    return (
      <div className="table-loading">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="table-container">
      <TableContainer component={Paper} className="mui-table-container">
        <MuiTable>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header.key}>{header.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell 
                    key={header.key}
                    onClick={() => handleCellClick(row, header.key)}
                    className={header.isModal ? 'clickable-cell' : ''}
                  >
                    {customRenderers[header.key] 
                      ? customRenderers[header.key](row[header.key])
                      : row[header.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <ArrowBackIosNewIcon />
        </button>
        <span className="page-info">
          Página {page} de {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          <ArrowForwardIosIcon />
        </button>
      </div>
    </div>
  );
};

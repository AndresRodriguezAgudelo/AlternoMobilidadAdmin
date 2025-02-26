import { ChangeEvent } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './styled.css';

interface InputSearchProps {
  onChange: (value: string) => void;
  placeholder?: string;
}

export const InputSearch = ({ onChange, placeholder = 'Buscar...' }: InputSearchProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        onChange={handleChange}
      />
      <SearchIcon className="search-icon" />
    </div>
  );
};

import './styled.css';

interface InputSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export const InputSelect = ({ label, value, options, onChange }: InputSelectProps) => {
  return (
    <div className="select-container">
      <label className="select-label">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select-input"
      >
        <option value="" disabled>
          Seleccione una opción
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

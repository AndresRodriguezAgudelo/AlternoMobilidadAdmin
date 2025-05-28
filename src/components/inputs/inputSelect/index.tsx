import './styled.css';

interface OptionType { label: string; value: string; }
interface InputSelectProps {
  label: string;
  value: string;
  options: Array<string | OptionType>;
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
          typeof option === 'string' ? (
            <option key={option} value={option}>{option}</option>
          ) : (
            <option key={option.value} value={option.value}>{option.label}</option>
          )
        ))}
      </select>
    </div>
  );
};

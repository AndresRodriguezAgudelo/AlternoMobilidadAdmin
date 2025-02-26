import './styled.css';

interface InputDateProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const InputDate = ({ label, value, onChange }: InputDateProps) => {
  return (
    <div className="input-date-container">
      <label className="input-date-label">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-date"
      />
    </div>
  );
};

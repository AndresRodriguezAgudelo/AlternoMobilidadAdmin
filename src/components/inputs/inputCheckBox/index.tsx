import './styled.css';

interface InputCheckBoxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const InputCheckBox = ({ label, checked, onChange }: InputCheckBoxProps) => {
  return (
    <label className="input-checkbox-container">
      <input
        type="checkbox"
        className="input-checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="input-checkbox-label">{label}</span>
    </label>
  );
};

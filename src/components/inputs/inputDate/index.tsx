import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import { useState } from "react";

interface InputDateProps {
  label: string;
  value: string; // Se mantiene como string (YYYY-MM-DD) para compatibilidad
  onChange: (value: string) => void;
}

export const InputDate = ({ label, value, onChange }: InputDateProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      onChange(date.toISOString().split("T")[0]); // Convierte a formato YYYY-MM-DD
    } else {
      onChange(""); // Si se limpia la fecha
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <label className="select-label">{label}</label>
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        slots={{
          textField: TextField
        }}
        slotProps={{
          textField: {
            size: "small",
            fullWidth: true
          }
        }}
      />
    </LocalizationProvider>
  );
};

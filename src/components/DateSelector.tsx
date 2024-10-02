import React, { useState } from "react";

interface Props {
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<Props> = ({ onDateChange }) => {
  const [date, setDate] = useState<Date>(new Date());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setDate(selectedDate);
    onDateChange(selectedDate);
  };

  // Formato YYYY-MM para el input de tipo month
  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">Selecciona fecha de facturación:</h3>
      <input
        type="month"
        className="border py-2 px-4 rounded-lg mb-2 w-full"
        value={formattedDate}
        onChange={handleChange}
      />
      <p className="mt-2">
        Fecha seleccionada: {date.getMonth() + 1}/{date.getFullYear()}
      </p>
    </div>
  );
};

export default DateSelector;

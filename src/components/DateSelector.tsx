import React, { useEffect, useState } from "react";

interface Props {
  onDateChange: (date: Date) => void;
  onConfirm: () => void;
}

const DateSelector: React.FC<Props> = ({ onDateChange, onConfirm }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setDate(selectedDate);
    onDateChange(selectedDate);
  };

  // Formato YYYY-MM para el input de tipo month
  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;

  useEffect(() => {
    if (date) {
      setIsAnimating(true);
    }
  }, [date]);

  return (
    <div className="flex flex-col items-center">
      <input
        type="month"
        className="border py-2 px-4 rounded-lg mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formattedDate}
        onChange={handleChange}
      />
      <p className="mt-2 text-gray-700">
        Fecha seleccionada: {date.getMonth() + 1}/{date.getFullYear()}
      </p>
      <button
        onClick={onConfirm}
        className={`bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full transition duration-200 focus:outline-none 
          ${isAnimating ? "pulse" : ""} 
          ${formattedDate ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onMouseEnter={() => setIsAnimating(true)}
      >
        Confirmar
      </button>
    </div>
  );
};

export default DateSelector;

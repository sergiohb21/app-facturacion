import React from "react";

interface Props {
  onSelect: (model: string) => void;
}

const InvoiceTypeSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">
        Selecciona el tipo de factura
      </h3>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-2 w-full"
        onClick={() => onSelect("Modelo1")}
      >
        Renta mensual
      </button>
    </div>
  );
};

export default InvoiceTypeSelector;

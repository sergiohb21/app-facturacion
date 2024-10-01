import React from "react";

interface Props {
  onSelect: (model: string) => void;
}
interface InvoiceType {
  id: string;
  label: string;
}

const invoiceTypes: InvoiceType[] = [
  { id: "REY 3, NAVE 6", label: "REY 3, NAVE 6" },
];

const InvoiceTypeSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">
        Selecciona el tipo de factura:
      </h3>
      {invoiceTypes?.map((type) => (
        <button
          key={type.id}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-2 w-full"
          onClick={() => onSelect(type.id)}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default InvoiceTypeSelector;

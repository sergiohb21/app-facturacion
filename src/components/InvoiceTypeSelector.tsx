import React, { useState } from "react";

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
  const [isAnimating, setIsAnimating] = useState(true); 

  const handleSelect = (model: string) => {
    onSelect(model); 
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center">
      {invoiceTypes?.map((type) => (
        <button
          key={type.id}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-2 w-full transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 ${
            isAnimating ? "pulse" : ""
          }`} 
          onClick={() => handleSelect(type.id)} 
          style={{ minHeight: "48px" }}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default InvoiceTypeSelector;

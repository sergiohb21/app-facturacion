import React, { useState } from "react";
import InvoiceTypeSelector from "./components/InvoiceTypeSelector";
import DateSelector from "./components/DateSelector";
import InvoiceGenerator from "./components/InvoiceGenerator";
import "./App.css";

const App: React.FC = () => {
  const [model, setModel] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Generador de Facturas</h1>
      <InvoiceTypeSelector onSelect={setModel} />
      <DateSelector onDateChange={setSelectedDate} />
      <InvoiceGenerator
        model={model}
        month={selectedDate.getMonth() + 1}
        year={selectedDate.getFullYear()}
        amount={816.0}
        subtotal={800.0}
        iva={168.0}
        irpf={152.0}
      />
    </div>
  );
};

export default App;

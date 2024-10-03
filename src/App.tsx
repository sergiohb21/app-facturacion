import React, { useState } from "react";
import InvoiceTypeSelector from "./components/InvoiceTypeSelector";
import DateSelector from "./components/DateSelector";
import InvoiceGenerator from "./components/InvoiceGenerator";
import "./App.css";

const App: React.FC = () => {
  const [model, setModel] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleModelSelect = (model: string) => {
    setModel(model);
    setCurrentStep(2);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDateConfirm = () => {
    setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(1);
    } else {
      setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="mb-8 text-3xl font-extrabold leading-tight tracking-tight text-center text-gray-900 md:text-5xl lg:text-6xl dark:text-black">
        Generador de Facturas
      </h1>
      {/* Indicador de Progreso */}
      <div className="mb-4">
        <p>{currentStep === 1 && `${currentStep}- Selecciona Tipo`}</p>
        <p>{currentStep === 2 && `${currentStep}- Selecciona Fecha`}</p>
        <p>{currentStep === 3 && `${currentStep}- Finalizado`}</p>
        <div className="w-full bg-gray-300">
          <div
            className="bg-blue-500 h-2"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>
      <div
        className={`w-full max-w-md mb-4 ${
          currentStep === 1 ? "animate-fadeIn" : "hidden"
        }`}
      >
        <InvoiceTypeSelector onSelect={handleModelSelect} />
      </div>
      <div
        className={`w-full max-w-md mb-4 ${
          currentStep === 2 ? "animate-fadeIn" : "hidden"
        }`}
      >
        <DateSelector
          onDateChange={handleDateChange}
          onConfirm={handleDateConfirm}
        />
      </div>
      <div
        className={`w-full max-w-md ${
          currentStep === 3 ? "animate-fadeIn" : "hidden"
        }`}
      >
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
      {currentStep > 1 && (
        <button
          onClick={handleBack}
          className="mt-4 bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400"
        >
          {currentStep === 3 ? "Generar otra factura" : "Atrás"}
        </button>
      )}
    </div>
  );
};

export default App;

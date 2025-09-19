import React from "react";

interface MobileStepsProps {
  currentStep: number;
}

const MobileSteps: React.FC<MobileStepsProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Modelo", description: "Seleccionar modelo" },
    { number: 2, label: "Fecha", description: "Seleccionar fecha" },
    { number: 3, label: "Generar", description: "Generar factura" }
  ];

  return (
    <div className="lg:hidden mb-4">
      {/* Indicador de pasos circular */}
      <div className="flex items-center justify-between mb-3">
        {steps.map((step) => (
          <React.Fragment key={step.number}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              currentStep >= step.number 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-secondary text-secondary-foreground'
            }`}>
              {step.number}
            </div>
            {step.number < 3 && (
              <div className={`flex-1 h-1 mx-1 rounded-full transition-all duration-300 ${
                currentStep > step.number ? 'bg-primary' : 'bg-secondary'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Descripción del paso actual */}
      <div className="text-center">
        <div className="text-base font-semibold text-foreground mb-1">
          {steps[currentStep - 1]?.label}
        </div>
        <div className="text-xs text-muted-foreground">
          Paso {currentStep} de 3
        </div>
      </div>
    </div>
  );
};

export default MobileSteps;
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { getStoredModels, type InvoiceModel } from "../lib/invoiceModels";

interface Props {
  onSelect: (model: string) => void;
}

const getTypeIcon = (type: InvoiceModel['type']) => {
  switch (type) {
    case 'industrial': return '🏭';
    case 'commercial': return '🏢';
    case 'logistics': return '📦';
    case 'office': return '🏢';
    default: return '📍';
  }
};

const getTypeColor = (type: InvoiceModel['type']) => {
  switch (type) {
    case 'industrial': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'commercial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'logistics': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'office': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const InvoiceTypeSelector: React.FC<Props> = ({ onSelect }) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [models, setModels] = useState<InvoiceModel[]>([]);

  useEffect(() => {
    const storedModels = getStoredModels();
    setModels(storedModels);
    
    // Escuchar cambios en los modelos
    const handleModelsChanged = (event: CustomEvent<InvoiceModel[]>) => {
      setModels(event.detail);
    };
    
    window.addEventListener('models-changed', handleModelsChanged as EventListener);
    
    return () => {
      window.removeEventListener('models-changed', handleModelsChanged as EventListener);
    };
  }, []);

  const handleSelect = (model: string) => {
    setSelectedType(model);
    setTimeout(() => onSelect(model), 200);
  };

  return (
    <div className="space-y-3">
      {models.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              No hay modelos de factura disponibles
            </p>
            <p className="text-sm text-muted-foreground">
              Crea tu primer modelo en la sección de gestión
            </p>
          </CardContent>
        </Card>
      ) : (
        models.map((model) => (
          <Card 
            key={model.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedType === model.id 
                ? "ring-2 ring-primary border-primary" 
                : "hover:border-primary/50"
            }`}
            onClick={() => handleSelect(model.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getTypeIcon(model.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm">{model.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(model.type)}`}>
                      {model.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {model.description}
                  </p>
                  <div className="text-xs font-medium text-primary">
                    {model.baseAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}/mes
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedType === model.id 
                    ? "bg-primary border-primary" 
                    : "border-muted-foreground"
                }`}>
                  {selectedType === model.id && (
                    <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )
      }
      
      <Button 
        className="w-full mt-4"
        disabled={!selectedType || models.length === 0}
        onClick={() => selectedType && onSelect(selectedType)}
      >
        Continuar
      </Button>
    </div>
  );
};

export default InvoiceTypeSelector;

import React, { useState, useEffect } from "react";
import InvoiceTypeSelector from "./components/InvoiceTypeSelector";
import DateSelector from "./components/DateSelector";
import InvoiceGenerator from "./components/InvoiceGenerator";
import ModelManagement from "./components/ModelManagement";
import InvoiceStatsComponent from "./components/InvoiceStats";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import MobileSteps from "./components/MobileSteps";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./contexts/ToastContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Moon, Sun, Settings, BarChart3 } from "lucide-react";
import { getModelById, calculateInvoiceAmounts, initializeDefaultModels } from "./lib/invoiceModels";
import "./App.css";

const App: React.FC = () => {
  const [model, setModel] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showModelManagement, setShowModelManagement] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);

  useEffect(() => {
    // Inicializar modelos por defecto
    initializeDefaultModels();
    
    // Configurar tema oscuro
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

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
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const resetApp = () => {
    setCurrentStep(1);
    setModel("");
    setSelectedDate(new Date());
  };

  const selectedModel = getModelById(model);
  const calculatedAmounts = selectedModel ? calculateInvoiceAmounts(selectedModel) : null;

  return (
    <ErrorBoundary>
      <ToastProvider>
        {/* Si estamos en modo gestión de modelos, mostrar el componente de gestión */}
        {showModelManagement ? (
          <div className="min-h-screen bg-background text-foreground px-2 py-2 sm:px-4 sm:py-4 flex flex-col mobile-safe-area">
            <div className="max-w-6xl md:max-w-4xl lg:max-w-6xl mx-auto flex-1">
              <ModelManagement onClose={() => setShowModelManagement(false)} />
            </div>
            <Footer className="hidden lg:block" />
          </div>
        ) : showStats ? (
          // Si estamos en modo estadísticas, mostrar el componente de estadísticas
          <div className="min-h-screen bg-background text-foreground px-2 py-2 sm:px-4 sm:py-4 flex flex-col mobile-safe-area">
            <div className="max-w-6xl md:max-w-4xl lg:max-w-6xl mx-auto flex-1">
              <InvoiceStatsComponent onClose={() => setShowStats(false)} />
            </div>
            <Footer className="hidden lg:block" />
          </div>
        ) : (
          // Aplicación principal
          <div className="min-h-screen bg-background text-foreground px-2 py-2 sm:px-4 sm:py-4 flex flex-col mobile-safe-area main-container">
      <div className="max-w-xs md:max-w-sm lg:max-w-md mx-auto flex-1 content-wrapper">
        {/* Header optimizado */}
        <div className="flex justify-between items-start mb-2 sm:mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Generador de Facturas</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Crea facturas profesionales</p>
          </div>
          <div className="flex gap-1 sm:gap-2 ml-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="shrink-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowStats(true)}
              className="shrink-0"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="sr-only">Estadísticas</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowModelManagement(true)}
              className="shrink-0"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Gestionar modelos</span>
            </Button>
          </div>
        </div>

        {/* Indicador de pasos para móvil */}
        <MobileSteps currentStep={currentStep} />
        
        {/* Indicador de Progreso - solo desktop */}
        <Card className="hidden lg:block mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {currentStep === 1 && "Paso 1: Seleccionar modelo"}
                {currentStep === 2 && "Paso 2: Seleccionar fecha"}
                {currentStep === 3 && "Paso 3: Generar factura"}
              </span>
              <span className="text-sm text-muted-foreground">{currentStep}/3</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contenido principal */}
        <div className="space-y-1 sm:space-y-2">
          <div
            className={`transition-all duration-300 ${
              currentStep === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute pointer-events-none"
            }`}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Seleccionar Modelo</CardTitle>
                <CardDescription>Elige el modelo de factura que deseas generar</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <InvoiceTypeSelector onSelect={handleModelSelect} />
              </CardContent>
            </Card>
          </div>

          <div
            className={`transition-all duration-300 ${
              currentStep === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute pointer-events-none"
            }`}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Seleccionar Fecha</CardTitle>
                <CardDescription>Elige el mes y año para la factura</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <DateSelector
                  onDateChange={handleDateChange}
                  onConfirm={handleDateConfirm}
                />
              </CardContent>
            </Card>
          </div>

          <div
            className={`transition-all duration-300 ${
              currentStep === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute pointer-events-none"
            }`}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Generar Factura</CardTitle>
                <CardDescription>Revisa los datos y genera la factura</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {selectedModel && calculatedAmounts && (
                  <InvoiceGenerator
                    model={model}
                    month={selectedDate.getMonth() + 1}
                    year={selectedDate.getFullYear()}
                    amount={calculatedAmounts.total}
                    subtotal={calculatedAmounts.subtotal}
                    iva={calculatedAmounts.iva}
                    irpf={calculatedAmounts.irpf}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botones de navegación - desktop */}
        {currentStep > 1 && (
          <div className="hidden lg:flex gap-2 mt-2 sm:mt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 xl"
            >
              Atrás
            </Button>
            {currentStep === 3 && (
              <Button
                onClick={resetApp}
                className="flex-1 xl"
              >
                Nueva Factura
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation para móviles */}
      <BottomNav 
        currentStep={currentStep}
        onBack={handleBack}
        onReset={resetApp}
      />
      
      {/* Footer - oculto en móviles */}
      <Footer className="hidden lg:block" />
    </div>
        )}
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
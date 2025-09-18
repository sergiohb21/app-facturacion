import React, { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarIcon, Clock, Info } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  onDateChange: (date: Date) => void;
  onConfirm: () => void;
}

const DateSelector: React.FC<Props> = ({ onDateChange, onConfirm }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onDateChange(selectedDate);
      setIsOpen(false);
    }
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="space-y-6">
      {/* Seleccionador de fecha mejorado */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Seleccionar mes y año de facturación
        </label>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal h-12"
            >
              <CalendarIcon className="mr-3 h-4 w-4" />
              {format(date, "MMMM yyyy", { locale: es })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              className="rounded-md border"
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Tarjeta de fecha seleccionada */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Fecha seleccionada</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">Periodo de facturación</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {monthNames[date.getMonth()]} {date.getFullYear()}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Factura correspondiente al periodo seleccionado
          </div>
        </div>
      </div>

      {/* Información importante */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start space-x-3">
          <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg mt-1">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">Información importante</h3>
            <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>La factura se generará automáticamente con los datos del mes seleccionado</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Los importes de IVA e IRPF se calcularán según la configuración del modelo</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Podrás descargar el PDF en alta calidad en el siguiente paso</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botón de confirmación mejorado */}
      <Button 
        size="lg"
        className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={onConfirm}
      >
        Confirmar fecha y generar factura
      </Button>
    </div>
  );
};

export default DateSelector;

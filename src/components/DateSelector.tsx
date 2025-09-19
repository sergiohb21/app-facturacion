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
    <div className="space-y-4">
      {/* Seleccionador de fecha mejorado */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Seleccionar mes y año de facturación
        </label>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal h-10"
            >
              <CalendarIcon className="mr-3 h-4 w-4" />
              {format(date, "MMMM yyyy", { locale: es })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-[calc(100vw-32px)] p-0" align="start">
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Fecha seleccionada</h3>
            <p className="text-xs text-blue-600 dark:text-blue-400">Periodo de facturación</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
            {monthNames[date.getMonth()]} {date.getFullYear()}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            Factura correspondiente al periodo seleccionado
          </div>
        </div>
      </div>

      {/* Información importante */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start space-x-3">
          <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg mt-0.5">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 text-sm">Información importante</h3>
            <ul className="space-y-1.5 text-xs text-amber-700 dark:text-amber-300">
              <li className="flex items-start">
                <span className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span>La factura se generará automáticamente con los datos del mes seleccionado</span>
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Los importes de IVA e IRPF se calcularán según la configuración del modelo</span>
              </li>
              <li className="flex items-start">
                <span className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Podrás descargar el PDF en alta calidad en el siguiente paso</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botón de confirmación mejorado */}
      <Button 
        className="w-full h-10 text-sm font-semibold"
        onClick={onConfirm}
      >
        Confirmar fecha y generar factura
      </Button>
    </div>
  );
};

export default DateSelector;

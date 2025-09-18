import React from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Download, AlertCircle, CheckCircle } from 'lucide-react';

interface InvoiceProgressProps {
  isGenerating: boolean;
  generationProgress: number;
  generationStatus: 'idle' | 'generating' | 'completed' | 'error';
}

const InvoiceProgress: React.FC<InvoiceProgressProps> = ({
  isGenerating,
  generationProgress,
  generationStatus,
}) => {
  if (!isGenerating) return null;

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                generationStatus === "error"
                  ? "bg-red-100 dark:bg-red-900"
                  : generationStatus === "completed"
                  ? "bg-green-100 dark:bg-green-900"
                  : "bg-blue-100 dark:bg-blue-900"
              }`}
            >
              {generationStatus === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              ) : generationStatus === "completed" ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">
                {generationStatus === "error"
                  ? "Error en la generación"
                  : generationStatus === "completed"
                  ? "¡Factura generada!"
                  : "Generando factura..."}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {generationStatus === "error"
                  ? "Ha ocurrido un error al generar el PDF"
                  : generationStatus === "completed"
                  ? "El PDF se ha descargado correctamente"
                  : "Por favor espera mientras se genera el documento"}
              </p>
            </div>
          </div>

          <Progress value={generationProgress} className="h-2" />

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {generationProgress < 20
                ? "Iniciando..."
                : generationProgress < 40
                ? "Procesando datos..."
                : generationProgress < 60
                ? "Generando contenido..."
                : generationProgress < 80
                ? "Aplicando formato..."
                : generationProgress < 100
                ? "Finalizando..."
                : generationStatus === "completed"
                ? "¡Completado!"
                : "Procesando..."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceProgress;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building2, Calendar, CreditCard } from 'lucide-react';
import { getMonthName } from '../utils/dateUtils';

interface InvoiceSummaryProps {
  model: string;
  modelName: string;
  landlordInfo?: {
    name: string;
    registeredCompanyName?: string;
  };
  month: number;
  year: number;
  amount: number;
  subtotal: number;
  iva: number;
  irpf: number;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  model,
  modelName,
  landlordInfo,
  month,
  year,
  amount,
  subtotal,
  iva,
  irpf,
}) => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3 text-blue-900 dark:text-blue-100">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Resumen de Factura</h2>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Revisa los detalles antes de generar
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Información del modelo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Modelo seleccionado
                </p>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  {modelName}
                </p>
              </div>
            </div>

            {landlordInfo && (
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                  Arrendador
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {landlordInfo.registeredCompanyName || landlordInfo.name}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Periodo
                </p>
                <p className="font-semibold text-purple-900 dark:text-purple-100">
                  {getMonthName(month)} {year}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Importe total
                </p>
                <p className="font-semibold text-orange-900 dark:text-orange-100 text-lg">
                  {amount.toFixed(2)} €
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalle de desglose */}
        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Desglose de importes
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Subtotal:
              </span>
              <span className="font-medium">{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                IVA (21%):
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                +{iva.toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                IRPF (19%):
              </span>
              <span className="font-medium text-red-600 dark:text-red-400">
                -{irpf.toFixed(2)} €
              </span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Total:
                </span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {amount.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceSummary;
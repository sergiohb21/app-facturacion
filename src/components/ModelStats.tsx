import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart3, TrendingUp, Building2, Calculator } from 'lucide-react';

interface ModelStatsProps {
  totalModels: number;
  averageBaseAmount: number;
  totalValue: number;
  modelTypes: Record<string, number>;
}

const ModelStats: React.FC<ModelStatsProps> = memo(({ 
  totalModels, 
  averageBaseAmount, 
  totalValue, 
  modelTypes 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Total Modelos
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {totalModels}
              </p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Promedio Base
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {averageBaseAmount.toFixed(2)}€
              </p>
            </div>
            <Calculator className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Valor Total
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {totalValue.toFixed(2)}€
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Tipos Activos
              </p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {Object.keys(modelTypes).length}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ModelStats.displayName = 'ModelStats';

export default ModelStats;
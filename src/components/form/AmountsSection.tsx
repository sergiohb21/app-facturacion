import React, { memo } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AmountsSectionProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
  getFieldError: (field: string) => string | undefined;
}

const AmountsSection: React.FC<AmountsSectionProps> = memo(({ 
  formData, 
  onFieldChange, 
  getFieldError 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Importes y Impuestos</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="baseAmount">Base Imponible *</Label>
          <Input
            id="baseAmount"
            type="number"
            value={formData.baseAmount || ''}
            onChange={(e) => onFieldChange('baseAmount', Number(e.target.value))}
            required
            className={getFieldError('baseAmount') ? 'border-red-500' : ''}
          />
          {getFieldError('baseAmount') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('baseAmount')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="iva">IVA (%)</Label>
          <Input
            id="iva"
            type="number"
            value={formData.ivaPercentage || ''}
            onChange={(e) => onFieldChange('ivaPercentage', Number(e.target.value))}
            className={getFieldError('ivaPercentage') ? 'border-red-500' : ''}
          />
          {getFieldError('ivaPercentage') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('ivaPercentage')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="irpf">IRPF (%)</Label>
          <Input
            id="irpf"
            type="number"
            value={formData.irpfPercentage || ''}
            onChange={(e) => onFieldChange('irpfPercentage', Number(e.target.value))}
            className={getFieldError('irpfPercentage') ? 'border-red-500' : ''}
          />
          {getFieldError('irpfPercentage') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('irpfPercentage')}</p>
          )}
        </div>
      </div>
    </div>
  );
});

AmountsSection.displayName = 'AmountsSection';

export default AmountsSection;
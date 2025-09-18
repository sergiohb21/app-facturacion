import React, { memo } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface LandlordInfoSectionProps {
  formData: any;
  onFieldChange: (field: string, value: any, nested?: string) => void;
  getFieldError: (field: string) => string | undefined;
}

const LandlordInfoSection: React.FC<LandlordInfoSectionProps> = memo(({ 
  formData, 
  onFieldChange, 
  getFieldError 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Información del Arrendador</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="landlordName">Nombre *</Label>
          <Input
            id="landlordName"
            value={formData.landlordInfo?.name || ''}
            onChange={(e) => onFieldChange('name', e.target.value, 'landlordInfo')}
            className={getFieldError('landlordInfo.name') ? 'border-red-500' : ''}
          />
          {getFieldError('landlordInfo.name') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('landlordInfo.name')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="landlordCompany">Empresa</Label>
          <Input
            id="landlordCompany"
            value={formData.landlordInfo?.registeredCompanyName || ''}
            onChange={(e) => onFieldChange('registeredCompanyName', e.target.value, 'landlordInfo')}
          />
        </div>
        <div>
          <Label htmlFor="documentType">Tipo Documento</Label>
          <select
            id="documentType"
            className="w-full px-3 py-2 border border-input bg-background rounded-md"
            value={formData.landlordInfo?.documentType || 'dni'}
            onChange={(e) => onFieldChange('documentType', e.target.value, 'landlordInfo')}
          >
            <option value="dni">DNI</option>
            <option value="nie">NIE</option>
            <option value="cif">CIF</option>
            <option value="passport">Pasaporte</option>
          </select>
        </div>
        <div>
          <Label htmlFor="documentNumber">Número Documento *</Label>
          <Input
            id="documentNumber"
            value={formData.landlordInfo?.documentNumber || ''}
            onChange={(e) => onFieldChange('documentNumber', e.target.value, 'landlordInfo')}
            className={getFieldError('landlordInfo.documentNumber') ? 'border-red-500' : ''}
          />
          {getFieldError('landlordInfo.documentNumber') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('landlordInfo.documentNumber')}</p>
          )}
        </div>
      </div>
    </div>
  );
});

LandlordInfoSection.displayName = 'LandlordInfoSection';

export default LandlordInfoSection;
import React, { memo } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface BasicInfoSectionProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
  getFieldError: (field: string) => string | undefined;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = memo(({ 
  formData, 
  onFieldChange, 
  getFieldError 
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Información Básica</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => onFieldChange('name', e.target.value)}
            required
            className={getFieldError('name') ? 'border-red-500' : ''}
          />
          {getFieldError('name') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('name')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="type">Tipo</Label>
          <select
            id="type"
            className="w-full px-3 py-2 border border-input bg-background rounded-md"
            value={formData.type || 'industrial'}
            onChange={(e) => onFieldChange('type', e.target.value)}
          >
            <option value="industrial">Industrial</option>
            <option value="commercial">Comercial</option>
            <option value="logistics">Logística</option>
            <option value="office">Oficina</option>
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={formData.description || ''}
          onChange={(e) => onFieldChange('description', e.target.value)}
        />
      </div>
    </div>
  );
});

BasicInfoSection.displayName = 'BasicInfoSection';

export default BasicInfoSection;
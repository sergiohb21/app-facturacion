import React, { useCallback, useMemo } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useFormState } from '../hooks/useFormState';
import { useFormValidation } from '../hooks/useFormValidation';
import { useDebounce } from '../hooks/useDebounce';
import FormLayout from './form/FormLayout';
import BasicInfoSection from './form/BasicInfoSection';
import AmountsSection from './form/AmountsSection';
import LandlordInfoSection from './form/LandlordInfoSection';
import type { InvoiceModel } from '../lib/invoiceModels';
import type { ModelFormProps } from '../types';

const ModelForm: React.FC<ModelFormProps> = ({ model, onSave, onCancel, isEditing = false }) => {
  const { showToast } = useToast();
  
  // Use custom form state hook
  const [formData, formActions] = useFormState({ initialModel: model });
  
  // Use custom validation hook with debounced validation
  const debouncedFormData = useDebounce({ value: formData, delay: 300 });
  const { validateField: validateFieldHandler, validateNestedField, validateForm, getFieldError } = useFormValidation({
    data: debouncedFormData
  });

  // Memoized form sections visibility
  const formSections = useMemo(() => ({
    showBasicInfo: true,
    showAmounts: true,
    showLandlordInfo: true
  }), []);

  // Memoized input change handler
  const handleInputChange = useCallback((field: string, value: any, nested?: string) => {
    if (nested) {
      formActions.updateNestedField(nested, field, value);
      validateNestedField(nested, field, value);
    } else {
      formActions.updateField(field, value);
      validateFieldHandler(field, value);
    }
  }, [formActions, validateFieldHandler, validateNestedField]);

  // Optimized submit handler
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const modelToSave: InvoiceModel = {
        id: formData.id || `model_${Date.now()}`,
        name: formData.name || '',
        description: formData.description || '',
        type: formData.type || 'industrial',
        baseAmount: formData.baseAmount || 0,
        ivaPercentage: formData.ivaPercentage || 21,
        irpfPercentage: formData.irpfPercentage || 19,
        features: formData.features || [],
        address: formData.address || '',
        contactInfo: {
          email: formData.contactInfo?.email || '',
          phone: formData.contactInfo?.phone || ''
        },
        landlordInfo: formData.landlordInfo ? {
          name: formData.landlordInfo.name,
          documentType: formData.landlordInfo.documentType,
          documentNumber: formData.landlordInfo.documentNumber,
          address: formData.landlordInfo.address,
          city: formData.landlordInfo.city,
          postalCode: formData.landlordInfo.postalCode,
          province: formData.landlordInfo.province,
          phone: formData.landlordInfo.phone || '',
          email: formData.landlordInfo.email || '',
          bankAccount: formData.landlordInfo.bankAccount || '',
          registeredCompanyName: formData.landlordInfo.registeredCompanyName || ''
        } : undefined
      };

      onSave(modelToSave);
    } else {
      showToast('Por favor corrige los errores del formulario', 'error');
    }
  }, [formData, validateForm, onSave, showToast]);

  // Memoized form title
  const formTitle = useMemo(() => 
    isEditing ? 'Editar Modelo' : 'Crear Nuevo Modelo', 
    [isEditing]
  );

  const formDescription = useMemo(() => 
    isEditing 
      ? 'Modifica los datos del modelo existente' 
      : 'Completa los datos para crear un nuevo modelo de factura',
    [isEditing]
  );

  const submitButtonText = useMemo(() => 
    isEditing ? 'Actualizar Modelo' : 'Crear Modelo',
    [isEditing]
  );

  return (
    <FormLayout
      title={formTitle}
      description={formDescription}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitButtonText={submitButtonText}
    >
      {/* Información básica */}
      {formSections.showBasicInfo && (
        <BasicInfoSection
          formData={formData}
          onFieldChange={handleInputChange}
          getFieldError={getFieldError}
        />
      )}

      {/* Importes */}
      {formSections.showAmounts && (
        <AmountsSection
          formData={formData}
          onFieldChange={handleInputChange}
          getFieldError={getFieldError}
        />
      )}

      {/* Información del arrendador */}
      {formSections.showLandlordInfo && (
        <LandlordInfoSection
          formData={formData}
          onFieldChange={handleInputChange}
          getFieldError={getFieldError}
        />
      )}
    </FormLayout>
  );
};

export default ModelForm;
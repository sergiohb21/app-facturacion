import { useState, useEffect, useCallback } from 'react';
import type { InvoiceModel } from '../lib/invoiceModels';

interface UseFormStateProps {
  initialModel?: InvoiceModel | null;
}

interface FormStateActions {
  updateField: (field: string, value: any) => void;
  updateNestedField: (parent: string, field: string, value: any) => void;
  resetForm: (model?: InvoiceModel | null) => void;
  setFormData: (data: Partial<InvoiceModel>) => void;
  getFormData: () => Partial<InvoiceModel>;
}

const createDefaultFormData = (): Partial<InvoiceModel> => ({
  id: '',
  name: '',
  description: '',
  type: 'industrial',
  baseAmount: 0,
  ivaPercentage: 21,
  irpfPercentage: 19,
  features: [],
  address: '',
  contactInfo: {
    email: '',
    phone: ''
  },
  landlordInfo: {
    name: '',
    documentType: 'dni',
    documentNumber: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    phone: '',
    email: '',
    bankAccount: '',
    registeredCompanyName: ''
  }
});

export function useFormState({ initialModel }: UseFormStateProps = {}): [Partial<InvoiceModel>, FormStateActions] {
  const [formData, setFormData] = useState<Partial<InvoiceModel>>(() => {
    if (initialModel) {
      return initialModel;
    }
    return createDefaultFormData();
  });

  // Reset form when initialModel changes
  useEffect(() => {
    if (initialModel) {
      setFormData(initialModel);
    } else {
      setFormData(createDefaultFormData());
    }
  }, [initialModel]);

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateNestedField = useCallback((parent: string, field: string, value: any) => {
    setFormData(prev => {
      const parentObj = (prev as any)[parent] || {};
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: value
        }
      };
    });
  }, []);

  const resetForm = useCallback((model?: InvoiceModel | null) => {
    if (model) {
      setFormData(model);
    } else {
      setFormData(createDefaultFormData());
    }
  }, []);

  const setFormDataDirect = useCallback((data: Partial<InvoiceModel>) => {
    setFormData(data);
  }, []);

  const getFormData = useCallback((): Partial<InvoiceModel> => {
    return formData;
  }, [formData]);

  const actions: FormStateActions = {
    updateField,
    updateNestedField,
    resetForm,
    setFormData: setFormDataDirect,
    getFormData
  };

  return [formData, actions];
}
import { useState, useCallback, useMemo } from 'react';
import { validateField, validateNestedField, validateInvoiceModel } from '../lib/formValidation';
import type { InvoiceModel } from '../lib/invoiceModels';

interface ValidationError {
  field: string;
  message: string;
}

interface UseFormValidationProps {
  data: Partial<InvoiceModel>;
}

interface UseFormValidationReturn {
  errors: ValidationError[];
  validateField: (field: string, value: any) => ValidationError | null;
  validateNestedField: (parent: string, field: string, value: any) => ValidationError | null;
  validateForm: () => boolean;
  clearErrors: () => void;
  hasErrors: boolean;
  getFieldError: (field: string) => string | undefined;
}

export function useFormValidation({ data }: UseFormValidationProps): UseFormValidationReturn {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateFieldHandler = useCallback((field: string, value: any): ValidationError | null => {
    const error = validateField(field, value);
    
    setErrors(prev => {
      const filtered = prev.filter(e => e.field !== field);
      return error ? [...filtered, error] : filtered;
    });

    return error;
  }, []);

  const validateNestedFieldHandler = useCallback((parent: string, field: string, value: any): ValidationError | null => {
    const error = validateNestedField(parent, field, value);
    const fullPath = `${parent}.${field}`;
    
    setErrors(prev => {
      const filtered = prev.filter(e => e.field !== fullPath);
      return error ? [...filtered, { ...error, field: fullPath }] : filtered;
    });

    return error ? { ...error, field: fullPath } : null;
  }, []);

  const validateForm = useCallback((): boolean => {
    const result = validateInvoiceModel(data);
    
    if (result.success) {
      setErrors([]);
      return true;
    } else {
      setErrors(result.errors);
      return false;
    }
  }, [data]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const hasErrors = useMemo(() => errors.length > 0, [errors]);

  const getFieldError = useCallback((field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  }, [errors]);

  return {
    errors,
    validateField: validateFieldHandler,
    validateNestedField: validateNestedFieldHandler,
    validateForm,
    clearErrors,
    hasErrors,
    getFieldError
  };
}
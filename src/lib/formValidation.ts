import type { InvoiceModel } from '../lib/invoiceModels';

// Interfaz para errores de validación
export interface ValidationError {
  field: string;
  message: string;
}

// Interfaz para reglas de validación
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean | string;
  message?: string;
}

// Esquema de validación
export const validationSchema: Record<string, ValidationRule> = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'El nombre debe tener entre 2 y 100 caracteres'
  },
  description: {
    maxLength: 500,
    message: 'La descripción no puede tener más de 500 caracteres'
  },
  type: {
    required: true,
    custom: (value) => ['industrial', 'commercial', 'logistics', 'office'].includes(value),
    message: 'Tipo de modelo inválido'
  },
  baseAmount: {
    required: true,
    min: 0,
    message: 'La base imponible debe ser mayor o igual a 0'
  },
  ivaPercentage: {
    required: true,
    min: 0,
    max: 100,
    message: 'El IVA debe estar entre 0 y 100'
  },
  irpfPercentage: {
    required: true,
    min: 0,
    max: 100,
    message: 'El IRPF debe estar entre 0 y 100'
  },
  'landlordInfo.name': {
    required: true,
    minLength: 2,
    message: 'El nombre del arrendador debe tener al menos 2 caracteres'
  },
  'landlordInfo.documentType': {
    required: true,
    custom: (value) => ['dni', 'nie', 'cif', 'passport'].includes(value),
    message: 'Tipo de documento inválido'
  },
  'landlordInfo.documentNumber': {
    required: true,
    minLength: 5,
    message: 'El número de documento debe tener al menos 5 caracteres'
  },
  'landlordInfo.address': {
    required: true,
    minLength: 5,
    message: 'La dirección debe tener al menos 5 caracteres'
  },
  'landlordInfo.city': {
    required: true,
    minLength: 2,
    message: 'La ciudad debe tener al menos 2 caracteres'
  },
  'landlordInfo.postalCode': {
    required: true,
    pattern: /^\d{5}$/,
    message: 'El código postal debe tener 5 dígitos'
  },
  'landlordInfo.province': {
    required: true,
    minLength: 2,
    message: 'La provincia debe tener al menos 2 caracteres'
  },
  'landlordInfo.email': {
    custom: (value) => !value || /^\S+@\S+\.\S+$/.test(value),
    message: 'Correo electrónico inválido'
  }
};

// Función de validación principal
export function validateInvoiceModel(data: Partial<InvoiceModel>): { success: true; data: Partial<InvoiceModel> } | { success: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // Validar campos simples
  Object.entries(validationSchema).forEach(([field, rule]) => {
    if (!field.includes('.')) {
      const value = data[field as keyof InvoiceModel];
      const error = validateFieldWithRule(field, value, rule);
      if (error) errors.push(error);
    }
  });

  // Validar campos anidados
  if (data.landlordInfo) {
    Object.entries(validationSchema).forEach(([field, rule]) => {
      if (field.startsWith('landlordInfo.')) {
        const nestedField = field.replace('landlordInfo.', '');
        const value = (data.landlordInfo as any)[nestedField];
        const error = validateFieldWithRule(field, value, rule);
        if (error) errors.push(error);
      }
    });
  }

  return errors.length === 0 
    ? { success: true, data }
    : { success: false, errors };
}

// Función para validar un campo específico
export function validateField(fieldName: string, value: any): ValidationError | null {
  const rule = validationSchema[fieldName];
  if (!rule) return null;
  return validateFieldWithRule(fieldName, value, rule);
}

// Función para validar campo anidado
export function validateNestedField(parent: string, field: string, value: any): ValidationError | null {
  const fullPath = `${parent}.${field}`;
  const rule = validationSchema[fullPath];
  if (!rule) return null;
  return validateFieldWithRule(fullPath, value, rule);
}

// Función interna de validación
function validateFieldWithRule(field: string, value: any, rule: ValidationRule): ValidationError | null {
  if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return { field, message: rule.message || 'Este campo es obligatorio' };
  }

  if (value !== undefined && value !== null && value !== '') {
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return { field, message: rule.message || `Debe tener al menos ${rule.minLength} caracteres` };
    }

    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return { field, message: rule.message || `No puede tener más de ${rule.maxLength} caracteres` };
    }

    if (rule.min && typeof value === 'number' && value < rule.min) {
      return { field, message: rule.message || `El valor mínimo es ${rule.min}` };
    }

    if (rule.max && typeof value === 'number' && value > rule.max) {
      return { field, message: rule.message || `El valor máximo es ${rule.max}` };
    }

    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return { field, message: rule.message || 'Formato inválido' };
    }

    if (rule.custom) {
      const customResult = rule.custom(value);
      if (typeof customResult === 'string') {
        return { field, message: customResult };
      } else if (customResult === false) {
        return { field, message: rule.message || 'Valor inválido' };
      }
    }
  }

  return null;
}

// Tipos exportados
export type InvoiceModelFormData = Partial<InvoiceModel>;
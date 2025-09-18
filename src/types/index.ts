/**
 * Tipos para la aplicación de facturación
 */

// Modelo de factura
export interface InvoiceModel {
  id: string;
  name: string;
  description: string;
  type: 'industrial' | 'commercial' | 'logistics' | 'office';
  baseAmount: number;
  ivaPercentage: number;
  irpfPercentage: number;
  features: string[];
  address?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  // Datos del arrendador
  landlordInfo?: {
    name: string;
    documentType: 'dni' | 'nie' | 'cif' | 'passport';
    documentNumber: string;
    address: string;
    city: string;
    postalCode: string;
    province: string;
    phone?: string;
    email?: string;
    bankAccount?: string;
    registeredCompanyName?: string;
  };
}

// Registro de factura generada
export interface InvoiceRecord {
  id: string;
  modelId: string;
  modelName: string;
  month: number;
  year: number;
  amount: number;
  subtotal: number;
  iva: number;
  irpf: number;
  generatedAt: Date;
  fileName: string;
  landlordInfo?: {
    name: string;
    documentType: string;
    documentNumber: string;
  };
}

// Estadísticas de facturas
export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  invoicesByYear: Record<number, {
    count: number;
    amount: number;
  }>;
  invoicesByModel: Record<string, {
    count: number;
    amount: number;
    modelName: string;
  }>;
  lastGenerated?: Date;
  mostRecentMonth?: {
    month: number;
    year: number;
    count: number;
  };
}

// Importes calculados de factura
export interface InvoiceAmounts {
  subtotal: number;
  iva: number;
  irpf: number;
  total: number;
}

// Props para componentes
export interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onConfirm: () => void;
  onBack?: () => void;
}

export interface InvoiceTypeSelectorProps {
  onSelect: (modelId: string) => void;
}

export interface ModelFormProps {
  model: InvoiceModel | null;
  onSave: (model: InvoiceModel) => void;
  onCancel: () => void;
  isEditing?: boolean;
}
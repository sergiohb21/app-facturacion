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
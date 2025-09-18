import { ModelStorageService } from './modelStorage';
import type { InvoiceModel, InvoiceAmounts } from '../types';

// Modelos por defecto - Extraído del código original
export const defaultModels: InvoiceModel[] = [
  {
    id: "REY_3_NAVE_6",
    name: "REY 3, NAVE 6",
    description: "Nave industrial en Polígono Industrial Los Perales",
    type: "industrial",
    baseAmount: 885,
    ivaPercentage: 21,
    irpfPercentage: 19,
    features: [
      "Nave industrial para almacenaje y producción",
      "Ubicada en Polígono Industrial Los Perales",
      "Espacio diáfano de 500m²",
      "Altura de techo 6m",
      "Carretilla elevadora"
    ],
    address: "REY 3, NAVE 6, POL. IND. LOS PERALES, 28609 SEVILLA LA NUEVA, MADRID",
    contactInfo: {
      email: "info@imex-ples.es",
      phone: "+34 607 624 252"
    },
    landlordInfo: {
      name: "IMEX-PLES S.L.",
      documentType: "cif",
      documentNumber: "B87627295",
      address: "REY 3, NAVE 6",
      city: "POL. IND. LOS PERALES",
      postalCode: "28609",
      province: "MADRID",
      phone: "+34 607 624 252",
      email: "info@imex-ples.es",
      bankAccount: "ES00 0000 0000 0000 0000 0000",
      registeredCompanyName: "IMEX-PLES S.L."
    }
  }
];

// Funciones para trabajar con modelos (ahora usan el servicio de almacenamiento)
export const getStoredModels = (): InvoiceModel[] => {
  return ModelStorageService.getModels();
};

export const getModelById = (id: string): InvoiceModel | undefined => {
  return ModelStorageService.getModelById(id) || undefined;
};

export const saveModel = (model: InvoiceModel): void => {
  ModelStorageService.saveModel(model);
};

export const deleteModel = (id: string): void => {
  ModelStorageService.deleteModel(id);
};

// Función para calcular importes
export const calculateInvoiceAmounts = (model: InvoiceModel): InvoiceAmounts => {
  const subtotal = model.baseAmount;
  const iva = Math.round(subtotal * (model.ivaPercentage / 100));
  const irpf = Math.round(subtotal * (model.irpfPercentage / 100));
  const total = subtotal + iva - irpf;

  return {
    subtotal,
    iva,
    irpf,
    total,
  };
};

// Inicializar modelos por defecto si no existen
export const initializeDefaultModels = (): void => {
  const storedModels = getStoredModels();
  if (storedModels.length === 0) {
    defaultModels.forEach(model => saveModel(model));
  }
};

export type { InvoiceModel, InvoiceAmounts };
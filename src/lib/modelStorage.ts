import { InvoiceModel } from './invoiceModels';

const STORAGE_KEY = 'invoice-models';

export class ModelStorageService {
  // Inicializar el almacenamiento con los modelos por defecto si está vacío
  static initializeStorage(): void {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }

  // Obtener todos los modelos
  static getModels(): InvoiceModel[] {
    this.initializeStorage();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const models = stored ? JSON.parse(stored) : [];
      return models;
    } catch (error) {
      console.error('Error al cargar modelos:', error);
      return [];
    }
  }

  // Guardar un modelo (crear o actualizar)
  static saveModel(model: InvoiceModel): void {
    this.initializeStorage();
    try {
      const models = this.getModels();
      const existingIndex = models.findIndex(m => m.id === model.id);
      
      if (existingIndex >= 0) {
        // Actualizar modelo existente
        models[existingIndex] = model;
      } else {
        // Crear nuevo modelo
        models.push(model);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
      
      // Disparar evento personalizado para notificar cambios
      window.dispatchEvent(new CustomEvent('models-changed', { detail: models }));
    } catch (error) {
      console.error('Error al guardar modelo:', error);
    }
  }

  // Eliminar un modelo
  static deleteModel(modelId: string): void {
    this.initializeStorage();
    try {
      const models = this.getModels();
      const filteredModels = models.filter(m => m.id !== modelId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredModels));
      
      // Disparar evento personalizado para notificar cambios
      window.dispatchEvent(new CustomEvent('models-changed', { detail: filteredModels }));
    } catch (error) {
      console.error('Error al eliminar modelo:', error);
    }
  }

  // Obtener un modelo por ID
  static getModelById(id: string): InvoiceModel | null {
    try {
      const models = this.getModels();
      return models.find(m => m.id === id) || null;
    } catch (error) {
      console.error('Error al obtener modelo por ID:', error);
      return null;
    }
  }

  // Verificar si un ID ya existe
  static modelExists(id: string): boolean {
    try {
      const models = this.getModels();
      return models.some(m => m.id === id);
    } catch (error) {
      console.error('Error al verificar existencia de modelo:', error);
      return false;
    }
  }

  // Generar un ID único
  static generateId(name: string): string {
    const base = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    let id = base;
    let counter = 1;
    
    while (this.modelExists(id)) {
      id = `${base}-${counter}`;
      counter++;
    }
    
    return id;
  }

  // Exportar modelos a JSON
  static exportModels(): string {
    try {
      const models = this.getModels();
      return JSON.stringify(models, null, 2);
    } catch (error) {
      console.error('Error al exportar modelos:', error);
      return '[]';
    }
  }

  // Importar modelos desde JSON
  static importModels(jsonData: string): { success: boolean; message: string } {
    try {
      const models = JSON.parse(jsonData);
      
      if (!Array.isArray(models)) {
        return { success: false, message: 'El formato de datos es inválido' };
      }

      // Validar que cada modelo tenga la estructura requerida
      const validModels = models.filter(model => 
        model.id && 
        model.name && 
        model.description && 
        model.type && 
        typeof model.baseAmount === 'number' &&
        model.landlordInfo && 
        model.landlordInfo.name && 
        model.landlordInfo.documentType && 
        model.landlordInfo.documentNumber && 
        model.landlordInfo.address && 
        model.landlordInfo.city && 
        model.landlordInfo.postalCode && 
        model.landlordInfo.province
      );

      if (validModels.length === 0) {
        return { success: false, message: 'No se encontraron modelos válidos' };
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(validModels));
      window.dispatchEvent(new CustomEvent('models-changed', { detail: validModels }));
      
      return { 
        success: true, 
        message: `Se importaron ${validModels.length} modelos correctamente` 
      };
    } catch (error) {
      console.error('Error al importar modelos:', error);
      return { success: false, message: 'Error al procesar el archivo JSON' };
    }
  }

  // Limpiar todos los modelos
  static clearAllModels(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('models-changed', { detail: [] }));
  }

  // Obtener estadísticas
  static getStats(): { total: number; byType: Record<string, number> } {
    const models = this.getModels();
    const stats = {
      total: models.length,
      byType: {} as Record<string, number>
    };

    models.forEach(model => {
      stats.byType[model.type] = (stats.byType[model.type] || 0) + 1;
    });

    return stats;
  }
}
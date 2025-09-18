import { InvoiceRecord, InvoiceStats } from './invoiceRecords';

const STORAGE_KEY = 'invoice-records';

export class InvoiceRecordsService {
  // Inicializar el almacenamiento
  static initializeStorage(): void {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }

  // Obtener todos los registros
  static getRecords(): InvoiceRecord[] {
    this.initializeStorage();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const records = stored ? JSON.parse(stored) : [];
      // Convertir fechas de string a Date objects
      return records.map((record: any) => ({
        ...record,
        generatedAt: new Date(record.generatedAt)
      }));
    } catch (error) {
      console.error('Error al cargar registros de facturas:', error);
      return [];
    }
  }

  // Guardar un registro
  static saveRecord(record: InvoiceRecord): { success: boolean; message?: string } {
    this.initializeStorage();
    try {
      // Verificar si ya existe una factura para el mismo modelo, mes y año
      if (this.invoiceExists(record.modelId, record.month, record.year)) {
        return { 
          success: false, 
          message: `Ya existe una factura para ${record.modelName} en ${record.month}/${record.year}` 
        };
      }
      
      const records = this.getRecords();
      records.push(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      
      // Disparar evento personalizado para notificar cambios
      window.dispatchEvent(new CustomEvent('invoice-records-changed', { detail: records }));
      
      return { success: true };
    } catch (error) {
      console.error('Error al guardar registro de factura:', error);
      return { success: false, message: 'Error al guardar la factura' };
    }
  }

  // Eliminar un registro
  static deleteRecord(recordId: string): void {
    this.initializeStorage();
    try {
      const records = this.getRecords();
      const filteredRecords = records.filter(r => r.id !== recordId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
      
      // Disparar evento personalizado para notificar cambios
      window.dispatchEvent(new CustomEvent('invoice-records-changed', { detail: filteredRecords }));
    } catch (error) {
      console.error('Error al eliminar registro de factura:', error);
    }
  }

  // Verificar si ya existe una factura para un modelo, mes y año
  static invoiceExists(modelId: string, month: number, year: number): boolean {
    const records = this.getRecords();
    return records.some(r => r.modelId === modelId && r.month === month && r.year === year);
  }

  // Obtener registros por mes y año
  static getRecordsByMonth(month: number, year: number): InvoiceRecord[] {
    const records = this.getRecords();
    return records.filter(r => r.month === month && r.year === year);
  }

  // Obtener registros por año
  static getRecordsByYear(year: number): InvoiceRecord[] {
    const records = this.getRecords();
    return records.filter(r => r.year === year);
  }

  // Obtener registros por modelo
  static getRecordsByModel(modelId: string): InvoiceRecord[] {
    const records = this.getRecords();
    return records.filter(r => r.modelId === modelId);
  }

  // Generar ID único
  static generateId(): string {
    return `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Calcular estadísticas
  static getStats(): InvoiceStats {
    const records = this.getRecords();
    
    const stats: InvoiceStats = {
      totalInvoices: records.length,
      totalAmount: records.reduce((sum, r) => sum + r.amount, 0),
      invoicesByYear: {},
      invoicesByModel: {},
    };

    // Agrupar por año
    records.forEach(record => {
      if (!stats.invoicesByYear[record.year]) {
        stats.invoicesByYear[record.year] = { count: 0, amount: 0 };
      }
      stats.invoicesByYear[record.year].count++;
      stats.invoicesByYear[record.year].amount += record.amount;
    });

    // Agrupar por modelo
    records.forEach(record => {
      if (!stats.invoicesByModel[record.modelId]) {
        stats.invoicesByModel[record.modelId] = { 
          count: 0, 
          amount: 0,
          modelName: record.modelName
        };
      }
      stats.invoicesByModel[record.modelId].count++;
      stats.invoicesByModel[record.modelId].amount += record.amount;
    });

    // Última factura generada
    if (records.length > 0) {
      stats.lastGenerated = new Date(Math.max(...records.map(r => r.generatedAt.getTime())));
    }

    // Mes más reciente con facturas
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    for (let month = currentMonth; month >= 1; month--) {
      const monthRecords = records.filter(r => r.year === currentYear && r.month === month);
      if (monthRecords.length > 0) {
        stats.mostRecentMonth = {
          month,
          year: currentYear,
          count: monthRecords.length
        };
        break;
      }
    }

    return stats;
  }

  // Limpiar todos los registros
  static clearAllRecords(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('invoice-records-changed', { detail: [] }));
  }

  // Exportar registros a JSON
  static exportRecords(): string {
    try {
      const records = this.getRecords();
      return JSON.stringify(records, null, 2);
    } catch (error) {
      console.error('Error al exportar registros:', error);
      return '[]';
    }
  }

  // Importar registros desde JSON
  static importRecords(jsonData: string): { success: boolean; message: string } {
    try {
      const records = JSON.parse(jsonData);
      
      if (!Array.isArray(records)) {
        return { success: false, message: 'El formato de datos es inválido' };
      }

      // Validar estructura básica
      const validRecords = records.filter(record => 
        record.id && 
        record.modelId && 
        record.month && 
        record.year && 
        record.amount &&
        record.generatedAt
      );

      if (validRecords.length === 0) {
        return { success: false, message: 'No se encontraron registros válidos' };
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(validRecords));
      window.dispatchEvent(new CustomEvent('invoice-records-changed', { detail: validRecords }));
      
      return { 
        success: true, 
        message: `Se importaron ${validRecords.length} registros correctamente` 
      };
    } catch (error) {
      console.error('Error al importar registros:', error);
      return { success: false, message: 'Error al procesar el archivo JSON' };
    }
  }
}
/**
 * Utilidades para manejo de fechas
 */

/**
 * Obtiene el nombre del mes en español
 * @param monthNumber Número del mes (1-12)
 * @returns Nombre del mes en mayúsculas
 */
export function getMonthName(monthNumber: number): string {
  const months = [
    "Enero",
    "Febrero", 
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return months[monthNumber - 1].toUpperCase();
}

/**
 * Formatea una fecha para mostrar en la interfaz
 * @param date Fecha a formatear
 * @returns Fecha formateada como string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
}

/**
 * Crea un objeto Date a partir de mes y año
 * @param month Mes (1-12)
 * @param year Año (4 dígitos)
 * @returns Objeto Date
 */
export function createDateFromMonthYear(month: number, year: number): Date {
  return new Date(year, month - 1, 1);
}

/**
 * Obtiene el número de días en un mes específico
 * @param year Año
 * @param month Mes (1-12)
 * @returns Número de días en el mes
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Verifica si una fecha está en el rango válido para facturas
 * @param date Fecha a verificar
 * @returns true si la fecha es válida
 */
export function isValidInvoiceDate(date: Date): boolean {
  const now = new Date();
  const fiveYearsAgo = new Date(now.getFullYear() - 5, 0, 1);
  return date >= fiveYearsAgo && date <= now;
}
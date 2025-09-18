import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { InvoiceModel } from '../lib/invoiceModels';
import { getMonthName } from '../utils/dateUtils';

interface PDFGeneratorProps {
  model: InvoiceModel;
  month: number;
  year: number;
  amount: number;
  subtotal: number;
  iva: number;
  irpf: number;
}

export class PDFGenerator {
  static async generatePDF(props: PDFGeneratorProps): Promise<Blob> {
    const { model, month, year, amount, subtotal, iva, irpf } = props;

    const doc = new jsPDF();

    // Título de la factura
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("FACTURA", 14, 20);
    doc.setFont("helvetica", "normal");
    doc.line(14, 22, 200, 22);

    // Información del cliente
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOMAS HERNÁNDEZ BATANERO", 14, 40);
    doc.setFont("helvetica", "normal");
    doc.text("C/ARCO Nº2", 14, 45);
    doc.text("28609 SEVILLA LA NUEVA", 14, 50);
    doc.text("MADRID", 14, 55);
    doc.text("N.I.F 50802704M", 14, 60);

    // Información del arrendador (dinámica)
    if (model.landlordInfo) {
      const landlord = model.landlordInfo;
      doc.setFont("helvetica", "bold");
      doc.text(landlord.registeredCompanyName || landlord.name, 140, 40);
      doc.setFont("helvetica", "normal");
      doc.text(landlord.address, 140, 45);
      doc.text(`${landlord.postalCode} ${landlord.city}`, 140, 50);
      doc.text(landlord.province, 140, 55);
      doc.text(
        `${landlord.documentType.toUpperCase()}: ${landlord.documentNumber}`,
        140,
        60
      );
    } else {
      // Fallback por si no hay datos del arrendador
      doc.setFont("helvetica", "bold");
      doc.text("ARRENDADOR", 140, 40);
      doc.setFont("helvetica", "normal");
      doc.text(model.name || "Modelo sin especificar", 140, 45);
      doc.text("Complete los datos del arrendador", 140, 50);
    }

    // Detalles de la factura
    doc.text(`Fecha: 01/${month}/${year}`, 14, 85);
    doc.text(`Factura: ${month}/${year}`, 14, 90);

    // Crear la tabla con productos y totales
    doc.autoTable({
      head: [
        ["DESCRIPCIÓN", "SUBTOTAL", "IVA (21%)", "I.R.P.F. (19%)", "TOTAL"],
      ],
      body: [
        [
          `ALQUILER NAVE INDUSTRIAL\nMES DE ${getMonthName(month)}`,
          `${subtotal.toFixed(2)} €`,
          `${iva.toFixed(2)} €`,
          `- ${irpf.toFixed(2)} €`,
          `${amount.toFixed(2)} €`,
        ],
      ],
      startY: 110,
      theme: "grid",
      styles: { fontSize: 12, cellPadding: 3 },
      headStyles: { fillColor: [0, 100, 200], textColor: 255 },
      columnStyles: {
        3: { textColor: [255, 0, 0] },
        4: { textColor: [0, 0, 0], fontStyle: "bold" },
      },
    });

    // Footer profesional con información del creador
    const footerY = 270;
    
    // Línea divisoria
    doc.setDrawColor(226, 232, 240);
    doc.line(14, footerY, 196, footerY);
    
    // Información de la aplicación y creador
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("Generado con FacturaPro App", 105, footerY + 5, { align: "center" });
    doc.text("Desarrollado por Sergio Hernández", 105, footerY + 10, { align: "center" });
    doc.text("GitHub: github.com/sergiohb21", 105, footerY + 15, { align: "center" });
    
    // Atribución a Claude AI
    doc.setFontSize(6);
    doc.setTextColor(156, 163, 175);
    doc.text("UI/UX mejorada con Claude Code", 105, footerY + 20, { align: "center" });

    return doc.output('blob');
  }

  static getFileName(model: string, month: number, year: number): string {
    return `FACTURA_${model}_${month}_${year}.pdf`;
  }
}
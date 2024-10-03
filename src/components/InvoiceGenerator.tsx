import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Props {
  model: string;
  month: number;
  year: number;
  amount: number;
  subtotal: number;
  iva: number;
  irpf: number;
}

export function getMonthName(monthNumber: number) {
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

const InvoiceGenerator: React.FC<Props> = ({
  model,
  month,
  year,
  amount,
  subtotal,
  iva,
  irpf,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const generatePDF = () => {
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

    // Información de la empresa
    doc.setFont("helvetica", "bold");
    doc.text("IMEX-PLES S.L.", 140, 40);
    doc.setFont("helvetica", "normal");
    doc.text("REY 3, NAVE 6", 140, 45);
    doc.text("POL. IND. LOS PERALES", 140, 50);
    doc.text("28609 SEVILLA LA NUEVA", 140, 55);
    doc.text("MADRID", 140, 60);
    doc.text("C.I.F. B87627295", 140, 65);

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

    // Guardar PDF
    const pdfFileName = `FACTURA_${model}_${month}_${year}.pdf`;
    doc.save(pdfFileName);

    // Quitar la animación una vez que se ha generado el PDF
    setIsAnimating(false);
  };

  return (
    <div
      ref={invoiceRef}
      className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg w-full max-w-lg"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Resumen:
      </h3>
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600"><strong>Modelo:</strong> {model}</p>
        <p className="text-sm text-gray-600"><strong>Mes:</strong> {getMonthName(month)}</p>
        <p className="text-sm text-gray-600"><strong>Año:</strong> {year}</p>
        <p className="text-sm text-gray-600"><strong>Importe:</strong> {amount.toFixed(2)} €</p>

      </div>
      <button
        className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg w-full transition duration-200 focus:outline-none ${
          model && month && year
            ? `opacity-100 ${isAnimating ? "pulse" : ""}`
            : "opacity-0 pointer-events-none"
        }`}
        onClick={generatePDF}
        onMouseEnter={() => setIsAnimating(true)}
      >
        Descargar
      </button>
    </div>
  );
};

export default InvoiceGenerator;

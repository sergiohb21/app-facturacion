import React, { useState, useMemo } from "react";
import { getModelById } from "../lib/invoiceModels";
import { InvoiceRecordsService } from "../lib/invoiceRecordsService";
import { PDFGenerator } from "../lib/pdfGenerator";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceProgress from "./InvoiceProgress";
import { Button } from "./ui/button";
import SuccessModal from "./ui/SuccessModal";
import { Download } from "lucide-react";

interface Props {
  model: string;
  month: number;
  year: number;
  amount: number;
  subtotal: number;
  iva: number;
  irpf: number;
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "generating" | "completed" | "error"
  >("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedFileName, setGeneratedFileName] = useState("");
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");

  const selectedModel = useMemo(() => getModelById(model), [model]);

  const generatePDF = async () => {
    if (!selectedModel) return;

    setIsGenerating(true);
    setGenerationStatus("generating");
    setGenerationProgress(0);

    try {
      // Simular proceso de generación con pasos
      const steps = [
        { progress: 20, message: "Iniciando generación..." },
        { progress: 40, message: "Procesando datos de factura..." },
        { progress: 60, message: "Generando contenido PDF..." },
        { progress: 80, message: "Aplicando formato y estilos..." },
        { progress: 100, message: "Finalizando documento..." },
      ];

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setGenerationProgress(step.progress);
      }

      // Generar PDF usando la clase separada
      const pdfBlob = await PDFGenerator.generatePDF({
        model: selectedModel,
        month,
        year,
        amount,
        subtotal,
        iva,
        irpf,
      });

      const pdfFileName = PDFGenerator.getFileName(model, month, year);
      setGeneratedFileName(pdfFileName);
      
      // Crear blob URL para poder abrir el archivo
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfBlobUrl(blobUrl);
      
      // Descargar PDF
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = pdfFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Registrar la factura generada
      const record = {
        id: InvoiceRecordsService.generateId(),
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        month,
        year,
        amount,
        subtotal,
        iva,
        irpf,
        generatedAt: new Date(),
        fileName: pdfFileName,
        landlordInfo: selectedModel.landlordInfo
          ? {
              name: selectedModel.landlordInfo.name,
              documentType: selectedModel.landlordInfo.documentType,
              documentNumber: selectedModel.landlordInfo.documentNumber,
            }
          : undefined,
      };

      const result = InvoiceRecordsService.saveRecord(record);
      if (!result.success) {
        console.warn(result.message);
      }

      // Éxito
      setGenerationStatus("completed");

      // Mostrar modal de éxito
      setTimeout(() => {
        setShowSuccessModal(true);
        setIsGenerating(false);
        setGenerationProgress(0);
        setGenerationStatus("idle");
      }, 1000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setGenerationStatus("error");

      // Resetear después de 2 segundos
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        setGenerationStatus("idle");
      }, 2000);
    }
  };

  const openPDF = () => {
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, '_blank');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* Resumen de la factura */}
      {selectedModel && (
        <InvoiceSummary
          model={model}
          modelName={selectedModel.name}
          landlordInfo={selectedModel.landlordInfo}
          month={month}
          year={year}
          amount={amount}
          subtotal={subtotal}
          iva={iva}
          irpf={irpf}
        />
      )}

      {/* Estado de generación */}
      <InvoiceProgress
        isGenerating={isGenerating}
        generationProgress={generationProgress}
        generationStatus={generationStatus}
      />

      {/* Botón de descarga */}
      <Button
        size="lg"
        className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        onClick={generatePDF}
        disabled={isGenerating || !model || !month || !year}
      >
        <div className="flex items-center space-x-3">
          {isGenerating ? (
            <Download className="h-5 w-5 animate-bounce" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          <span>
            {isGenerating
              ? "Generando factura..."
              : generationStatus === "completed"
              ? "¡Factura generada!"
              : "Descargar factura PDF"}
          </span>
        </div>
      </Button>

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          // Limpiar blob URL para evitar memory leaks
          if (pdfBlobUrl) {
            URL.revokeObjectURL(pdfBlobUrl);
            setPdfBlobUrl("");
          }
        }}
        title="¡Factura generada con éxito!"
        message="La factura ha sido generada y descargada correctamente en tu carpeta de Descargas."
        fileName={generatedFileName}
        fileType="pdf"
        actionText="Abrir"
        onOpen={openPDF}
      />
    </div>
  );
};

export default InvoiceGenerator;
/// <reference types="react-scripts" />
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof import("jspdf-autotable").autoTable;
    lastAutoTable: {
      finalY: number;
    };
  }
}

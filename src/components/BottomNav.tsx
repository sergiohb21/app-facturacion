import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, FileText } from "lucide-react";

interface BottomNavProps {
  currentStep: number;
  onBack: () => void;
  onReset: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentStep, onBack, onReset }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-2 lg:hidden z-50">
      <div className="flex gap-2 max-w-md mx-auto">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 h-9 flex items-center gap-2 text-xs"
          >
            <ArrowLeft className="h-3 w-3" />
            Atrás
          </Button>
        )}
        {currentStep === 3 && (
          <Button
            onClick={onReset}
            className="flex-1 h-9 flex items-center gap-2 text-xs"
          >
            <FileText className="h-3 w-3" />
            Nueva Factura
          </Button>
        )}
      </div>
    </div>
  );
};

export default BottomNav;
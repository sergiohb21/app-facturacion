import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { CheckCircle, Download, FileText, X, ExternalLink } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  fileName?: string;
  fileType?: 'pdf' | 'json';
  actionText?: string;
  onOpen?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  fileName,
  fileType = 'pdf',
  actionText = 'Entendido',
  onOpen
}) => {
  if (!isOpen) return null;

  const getFileIcon = () => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-600" />;
      case 'json':
        return <Download className="h-6 w-6 text-green-600" />;
      default:
        return <FileText className="h-6 w-6 text-blue-600" />;
    }
  };

  const getFileColor = () => {
    switch (fileType) {
      case 'pdf':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      case 'json':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      default:
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center">
                  <div className="absolute">
                    <div className={`p-3 rounded-full ${getFileColor()}`}>
                      {getFileIcon()}
                    </div>
                  </div>
                  <div className="ml-16">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {message}
            </p>
            
            {fileName && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon()}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {fileName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Archivo guardado en Descargas
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {fileType.toUpperCase()}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              {onOpen && (
                <Button
                  onClick={() => {
                    onOpen();
                    onClose();
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>{actionText}</span>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6 py-2"
              >
                Cerrar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessModal;
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ConfirmationDialog from './ui/ConfirmationDialog';
import SuccessModal from './ui/SuccessModal';
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  Building2, 
  Download,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { InvoiceRecordsService } from '../lib/invoiceRecordsService';
import type { InvoiceRecord, InvoiceStats } from '../lib/invoiceRecords';
import { getMonthName } from '../utils/dateUtils';

interface InvoiceStatsProps {
  onClose?: () => void;
}

const InvoiceStatsComponent: React.FC<InvoiceStatsProps> = ({ onClose }) => {
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [recentRecords, setRecentRecords] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllRecords, setShowAllRecords] = useState(false);
  
  // Estados para los modales de confirmación
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<{
    id: string;
    modelName: string;
    month: number;
    year: number;
  } | null>(null);
  
  // Estados para el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [exportedFileName, setExportedFileName] = useState("");
  const [exportedFileUrl, setExportedFileUrl] = useState("");

  const loadData = useCallback(() => {
    try {
      const currentStats = InvoiceRecordsService.getStats();
      const allRecords = InvoiceRecordsService.getRecords();
      
      // Ordenar registros por fecha (más reciente primero)
      const sortedRecords = allRecords.sort((a, b) => 
        new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
      );
      
      setStats(currentStats);
      setRecentRecords(showAllRecords ? sortedRecords : sortedRecords.slice(0, 10));
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  }, [showAllRecords]);

  useEffect(() => {
    loadData();
    
    // Escuchar cambios en los registros
    const handleRecordsChanged = () => {
      loadData();
    };
    
    window.addEventListener('invoice-records-changed', handleRecordsChanged);
    return () => window.removeEventListener('invoice-records-changed', handleRecordsChanged);
  }, [loadData]);

  
  const clearAllRecords = () => {
    setShowClearAllDialog(true);
  };

  const deleteRecord = (recordId: string, modelName: string, month: number, year: number) => {
    setRecordToDelete({ id: recordId, modelName, month, year });
    setShowDeleteDialog(true);
  };

  const confirmClearAll = () => {
    InvoiceRecordsService.clearAllRecords();
    loadData();
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      InvoiceRecordsService.deleteRecord(recordToDelete.id);
      loadData();
      setRecordToDelete(null);
    }
  };

  const toggleShowAllRecords = () => {
    setShowAllRecords(!showAllRecords);
  };

  const exportRecords = () => {
    try {
      const jsonData = InvoiceRecordsService.exportRecords();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fileName = `historial_facturas_${new Date().toISOString().split('T')[0]}.json`;
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Guardar URL para posible apertura y mostrar modal de éxito
      setExportedFileName(fileName);
      setExportedFileUrl(url);
      setTimeout(() => setShowSuccessModal(true), 500);
    } catch (error) {
      console.error('Error al exportar registros:', error);
    }
  };

  const openJSON = () => {
    if (exportedFileUrl) {
      window.open(exportedFileUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay datos de estadísticas disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Estadísticas de Facturas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Historial y análisis de facturas generadas
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose} className="h-9">
            Cerrar
          </Button>
        )}
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Total Facturas
                </p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {stats.totalInvoices}
                </p>
              </div>
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400">
                  Importe Total
                </p>
                <p className="text-lg font-bold text-green-900 dark:text-green-100">
                  {stats.totalAmount.toFixed(2)} €
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                  Última Generada
                </p>
                <p className="text-xs font-bold text-purple-900 dark:text-purple-100">
                  {stats.mostRecentMonth 
                    ? `${getMonthName(stats.mostRecentMonth.month)} ${stats.mostRecentMonth.year}`
                    : 'Sin datos'
                  }
                </p>
              </div>
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                  Modelos Activos
                </p>
                <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                  {Object.keys(stats.invoicesByModel).length}
                </p>
              </div>
              <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas por año */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>Facturas por Año</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {Object.keys(stats.invoicesByYear).length === 0 ? (
            <p className="text-gray-500 text-center py-2 text-sm">No hay facturas registradas</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto">
              {Object.entries(stats.invoicesByYear)
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([year, data]) => (
                  <div key={year} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                    <h4 className="font-semibold text-sm mb-1">{year}</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Facturas:</span>
                        <span className="font-medium">{data.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Importe:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {data.amount.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas por modelo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Building2 className="h-4 w-4" />
            <span>Facturas por Modelo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {Object.keys(stats.invoicesByModel).length === 0 ? (
            <p className="text-gray-500 text-center py-2 text-sm">No hay facturas registradas</p>
          ) : (
            <div className="space-y-2 max-h-[30vh] overflow-y-auto">
              {Object.entries(stats.invoicesByModel)
                .sort(([,a], [,b]) => b.count - a.count)
                .map(([modelId, data]) => (
                  <div key={modelId} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-xs">{data.modelName}</h4>
                      <span className="text-xs text-gray-500">{data.count} facturas</span>
                    </div>
                    <div className="text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Importe total:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {data.amount.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial reciente */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <FileText className="h-4 w-4" />
              <span>Historial Reciente</span>
            </CardTitle>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={exportRecords} className="h-7 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Exportar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllRecords}
                className="text-red-600 hover:text-red-700 h-7 text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {recentRecords.length === 0 ? (
            <div className="text-center py-4">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No hay facturas generadas</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[35vh] overflow-y-auto">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-xs">{record.modelName}</p>
                      <p className="text-xs text-gray-500">
                        {getMonthName(record.month)} {record.year} • {record.amount.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(record.generatedAt).toLocaleDateString()}
                      </p>
                      {record.landlordInfo && (
                        <p className="text-xs text-gray-400">
                          {record.landlordInfo.name}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRecord(record.id, record.modelName, record.month, record.year)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {recentRecords.length >= 10 && (
                <div className="text-center pt-2">
                  <Button variant="outline" onClick={toggleShowAllRecords} className="h-8 text-xs">
                    {showAllRecords ? 'Mostrar menos' : 'Ver todas las facturas'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmación para eliminar todo */}
      <ConfirmationDialog
        isOpen={showClearAllDialog}
        onClose={() => setShowClearAllDialog(false)}
        onConfirm={confirmClearAll}
        title="Eliminar todo el historial"
        message="¿Estás seguro de que quieres eliminar todo el historial de facturas? Esta acción no se puede deshacer."
        confirmText="Eliminar todo"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de confirmación para eliminar una factura */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setRecordToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar factura"
        message={recordToDelete 
          ? `¿Estás seguro de que quieres eliminar la factura de ${recordToDelete.modelName} de ${getMonthName(recordToDelete.month)} ${recordToDelete.year}?`
          : ''
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de éxito para exportación */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          // Limpiar blob URL para evitar memory leaks
          if (exportedFileUrl) {
            URL.revokeObjectURL(exportedFileUrl);
            setExportedFileUrl("");
          }
        }}
        title="¡Exportación completada!"
        message="El historial de facturas ha sido exportado correctamente en formato JSON. Puedes usar este archivo para respaldar tus datos o importarlos en otra instancia."
        fileName={exportedFileName}
        fileType="json"
        actionText="Abrir"
        onOpen={openJSON}
      />
    </div>
  );
};

export default InvoiceStatsComponent;
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { InvoiceModel } from '../lib/invoiceModels';
import { ModelStorageService } from '../lib/modelStorage';
import ModelForm from './ModelForm';
import ConfirmationDialog from './ui/ConfirmationDialog';
import { useToast } from '../contexts/ToastContext';
import { Plus, Edit, Trash2, Download, Upload, BarChart3 } from 'lucide-react';

interface ModelManagementProps {
  onClose?: () => void;
}

const ModelManagement: React.FC<ModelManagementProps> = ({ onClose }) => {
  const [models, setModels] = useState<InvoiceModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<InvoiceModel | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadModels = useCallback(() => {
    const storedModels = ModelStorageService.getModels();
    setModels(storedModels);
  }, []);

  useEffect(() => {
    loadModels();
    
    // Escuchar cambios en los modelos
    const handleModelsChanged = (event: CustomEvent<InvoiceModel[]>) => {
      setModels(event.detail);
    };
    
    window.addEventListener('models-changed', handleModelsChanged as EventListener);
    
    return () => {
      window.removeEventListener('models-changed', handleModelsChanged as EventListener);
    };
  }, [loadModels]);

  const handleEdit = useCallback((model: InvoiceModel) => {
    setSelectedModel(model);
    setIsEditing(true);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((modelId: string) => {
    setModelToDelete(modelId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (modelToDelete) {
      ModelStorageService.deleteModel(modelToDelete);
      setModelToDelete(null);
      setDeleteDialogOpen(false);
      showToast('Modelo eliminado correctamente', 'success');
    }
  }, [modelToDelete, showToast]);

  const cancelDelete = useCallback(() => {
    setModelToDelete(null);
    setDeleteDialogOpen(false);
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedModel(null);
    setIsEditing(false);
    setShowForm(true);
  }, []);

  const handleSave = useCallback((model: InvoiceModel) => {
    ModelStorageService.saveModel(model);
    setShowForm(false);
    setSelectedModel(null);
  }, []);

  const handleExport = useCallback(() => {
    const data = ModelStorageService.exportModels();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-models-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const result = ModelStorageService.importModels(content);
        showToast(result.message, result.success ? 'success' : 'error');
      };
      reader.readAsText(file);
    }
  }, [showToast]);

  const filteredModels = useMemo(() => 
    models.filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.type.toLowerCase().includes(searchTerm.toLowerCase())
    ), [models, searchTerm]
  );

  const stats = useMemo(() => ModelStorageService.getStats(), []);

  if (showForm) {
    return (
      <ModelForm
        model={selectedModel}
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setSelectedModel(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Modelos</h2>
          <p className="text-muted-foreground">Administra tus modelos de factura</p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Volver
          </Button>
        )}
      </div>

      {/* Estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estadísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Modelos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Object.keys(stats.byType).length}
              </div>
              <div className="text-sm text-muted-foreground">Tipos</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Por tipo:</div>
            <div className="space-y-1">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="capitalize">{type}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleCreate} className="flex-1">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Modelo
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <div className="relative">
          <Input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Input
          placeholder="Buscar modelos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Lista de modelos */}
      <div className="space-y-3">
        {filteredModels.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? 'No se encontraron modelos' : 'No hay modelos disponibles'}
              </p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Crear primer modelo
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredModels.map((model) => (
            <Card key={model.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{model.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {model.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {model.description}
                    </p>
                    <div className="text-sm font-medium text-primary">
                      {model.baseAmount.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                      /mes
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      IVA: {model.ivaPercentage}% | IRPF: {model.irpfPercentage}%
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(model)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleDelete(model.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Eliminar Modelo"
        message="¿Estás seguro de que quieres eliminar este modelo? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmDelete}
        onClose={cancelDelete}
      />
    </div>
  );
};

export default ModelManagement;
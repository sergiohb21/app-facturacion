import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { InvoiceModel } from '../lib/invoiceModels';

interface ModelCardProps {
  model: InvoiceModel;
  onEdit: (model: InvoiceModel) => void;
  onDelete: (modelId: string) => void;
}

const ModelCard: React.FC<ModelCardProps> = memo(({ model, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{model.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{model.type}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(model)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(model.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">{model.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Base:</span> {model.baseAmount.toFixed(2)}€
            </div>
            <div>
              <span className="font-medium">IVA:</span> {model.ivaPercentage}%
            </div>
            <div>
              <span className="font-medium">IRPF:</span> {model.irpfPercentage}%
            </div>
            <div>
              <span className="font-medium">Total:</span> {(model.baseAmount * 1.21 * 0.81).toFixed(2)}€
            </div>
          </div>
          {model.landlordInfo && (
            <div className="pt-2 border-t">
              <p className="font-medium text-xs">Arrendador:</p>
              <p className="text-xs text-muted-foreground">
                {model.landlordInfo.registeredCompanyName || model.landlordInfo.name}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ModelCard.displayName = 'ModelCard';

export default ModelCard;
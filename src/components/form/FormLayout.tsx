import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface FormLayoutProps {
  title: string;
  description: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitButtonText: string;
  children: React.ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = memo(({ 
  title, 
  description, 
  onSubmit, 
  onCancel, 
  submitButtonText, 
  children 
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {children}
          
          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 h-10 text-sm">
              {submitButtonText}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="h-10 text-sm">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
});

FormLayout.displayName = 'FormLayout';

export default FormLayout;
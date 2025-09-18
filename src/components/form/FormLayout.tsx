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
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          {children}
          
          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {submitButtonText}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
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

import React from 'react';
import { useModuleAccess } from '@/hooks/useModuleAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface ModuleGuardProps {
  moduleName: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ 
  moduleName, 
  children, 
  fallback 
}) => {
  const { hasModuleAccess, loading } = useModuleAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasModuleAccess(moduleName)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Você não tem acesso ao módulo "{moduleName}". 
              Entre em contato com o administrador para solicitar acesso.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};


import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '@/components/ModuleProtection/ModuleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Search, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { CallFormDialog } from '@/components/Dialogs/CallFormDialog';
import { CallDetailsDialog } from '@/components/Dialogs/CallDetailsDialog';

const CallsPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: calls, loading, error, refetch } = useSupabaseData({
    table: 'call_history',
    select: '*',
    orderBy: { column: 'created_at', ascending: false }
  });

  const filteredCalls = calls?.filter(call => 
    call.phone_number?.toString().includes(searchTerm) ||
    call.transcription?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "Completa" : "Falhada"}
      </Badge>
    );
  };

  const handleViewDetails = (call: any) => {
    setSelectedCall(call);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chamadas</h1>
          <p className="text-muted-foreground">
            Gerencie e monitore o histórico de chamadas
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Chamada
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por número ou transcrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Erro ao carregar chamadas: {error}
            </p>
          </CardContent>
        </Card>
      ) : filteredCalls.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Phone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhuma chamada encontrada.' : 'Nenhuma chamada registrada ainda.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCalls.map((call) => (
            <Card key={call.id_call} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {call.phone_number || 'N/A'}
                  </CardTitle>
                  {getStatusIcon(call.status)}
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {call.created_at ? new Date(call.created_at).toLocaleString('pt-BR') : 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(call.status)}
                  </div>
                  {call.total_call_time && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Duração:</span>
                      <span className="text-sm">{call.total_call_time}</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => handleViewDetails(call)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CallFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSuccess={() => {
          refetch();
          setIsFormOpen(false);
        }}
      />

      <CallDetailsDialog
        call={selectedCall}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default function CallsPage() {
  return (
    <ModuleGuard moduleName="calls">
      <CallsPageContent />
    </ModuleGuard>
  );
}

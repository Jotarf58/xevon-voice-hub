
import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '@/components/ModuleProtection/ModuleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Plus, Clock } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { MessageFormDialog } from '@/components/Dialogs/MessageFormDialog';
import { MessageDetailsDialog } from '@/components/Dialogs/MessageDetailsDialog';

const MessagesPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: messages, loading, error, refetch } = useSupabaseData({
    table: 'message_history',
    select: '*',
    orderBy: { column: 'created_at', ascending: false }
  });

  const filteredMessages = messages?.filter(message => 
    message.phone_number?.includes(searchTerm) ||
    message.content?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleViewDetails = (message: any) => {
    setSelectedMessage(message);
    setIsDetailsOpen(true);
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (!content) return 'N/A';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
          <p className="text-muted-foreground">
            Gerencie e monitore o histórico de mensagens
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Mensagem
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por número ou conteúdo..."
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
              Erro ao carregar mensagens: {error}
            </p>
          </CardContent>
        </Card>
      ) : filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhuma mensagem encontrada.' : 'Nenhuma mensagem registrada ainda.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMessages.map((message) => (
            <Card key={message.id_message} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {message.phone_number || 'N/A'}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {message.created_at ? new Date(message.created_at).toLocaleString('pt-BR') : 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {truncateContent(message.content)}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => handleViewDetails(message)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <MessageFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSuccess={() => {
          refetch();
          setIsFormOpen(false);
        }}
      />

      <MessageDetailsDialog
        message={selectedMessage}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default function MessagesPage() {
  return (
    <ModuleGuard moduleName="messages">
      <MessagesPageContent />
    </ModuleGuard>
  );
}

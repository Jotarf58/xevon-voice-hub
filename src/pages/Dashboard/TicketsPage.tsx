
import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '@/components/ModuleProtection/ModuleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Ticket, Search, Plus, AlertCircle } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { TicketFormDialog } from '@/components/Dialogs/TicketFormDialog';
import { TicketDetailsDialog } from '@/components/Dialogs/TicketDetailsDialog';

const TicketsPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: tickets, loading, error, refetch } = useSupabaseData({
    table: 'tickets',
    select: '*',
    orderBy: { column: 'id_ticket', ascending: false }
  });

  const filteredTickets = tickets?.filter(ticket => 
    ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.priority?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'alta':
      case 'high':
        return 'destructive';
      case 'média':
      case 'medium':
        return 'default';
      case 'baixa':
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleViewDetails = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDetailsOpen(true);
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">
            Gerencie e monitore tickets de suporte
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Ticket
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por título, descrição, categoria ou prioridade..."
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
              Erro ao carregar tickets: {error}
            </p>
          </CardContent>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Ticket className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum ticket encontrado.' : 'Nenhum ticket criado ainda.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id_ticket} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    {truncateText(ticket.title, 30)}
                  </CardTitle>
                  {ticket.priority === 'alta' || ticket.priority === 'high' ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : null}
                </div>
                <CardDescription>
                  Ticket #{ticket.id_ticket}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {truncateText(ticket.description)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Prioridade:</span>
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority || 'N/A'}
                    </Badge>
                  </div>
                  {ticket.category && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Categoria:</span>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => handleViewDetails(ticket)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TicketFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSuccess={() => {
          refetch();
          setIsFormOpen(false);
        }}
      />

      <TicketDetailsDialog
        ticket={selectedTicket}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default function TicketsPage() {
  return (
    <ModuleGuard moduleName="tickets">
      <TicketsPageContent />
    </ModuleGuard>
  );
}

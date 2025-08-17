import React, { useState } from 'react';
import { useTickets, useTicketOperations } from '@/hooks/useSupabaseData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Ticket, 
  Plus,
  Search,
  MoreHorizontal,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Edit,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketFormDialog } from '@/components/Dialogs/TicketFormDialog';
import { TicketDetailsDialog } from '@/components/Dialogs/TicketDetailsDialog';
import { useToast } from '@/hooks/use-toast';

interface TicketType {
  id: string;
  title: string;
  description: string | null;
  type: 'bug' | 'feature_request' | 'support' | 'integration' | 'configuration';
  status: 'open' | 'in_progress' | 'proposed_solution' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignee_id: string | null;
  reporter_id: string;
  team: 'technical' | 'support' | 'sales' | 'management';
  resolution: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export const TicketsPage: React.FC = () => {
  const { tickets, loading, error, refetch } = useTickets();
  const { createTicket, updateTicket, closeTicket } = useTicketOperations();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Funções de manipulação
  const handleCreateTicket = () => {
    setSelectedTicket(null);
    setIsFormOpen(true);
  };

  const handleEditTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsFormOpen(true);
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDetailsOpen(true);
  };

  const handleSaveTicket = async (ticketData: any) => {
    try {
      if (selectedTicket) {
        await updateTicket();
        toast({
          title: "Sucesso",
          description: "Ticket atualizado com sucesso!",
        });
      } else {
        await createTicket();
        toast({
          title: "Sucesso",
          description: "Ticket criado com sucesso!",
        });
      }
      refetch();
      setSelectedTicket(null);
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar ticket. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCloseTicket = async (ticketId: string, resolution: string = "Resolvido") => {
    try {
      await closeTicket();
      toast({
        title: "Sucesso",
        description: "Ticket fechado com sucesso!",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fechar ticket. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'proposed_solution': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Ticket className="h-4 w-4 text-blue-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'proposed_solution': return <AlertTriangle className="h-4 w-4 text-purple-600" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Ticket className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Progresso';
      case 'proposed_solution': return 'Solução Proposta';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bug': return 'Bug';
      case 'feature_request': return 'Nova Funcionalidade';
      case 'support': return 'Suporte';
      case 'integration': return 'Integração';
      case 'configuration': return 'Configuração';
      default: return type;
    }
  };

  const filteredTickets = tickets
    .filter(ticket => 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.description && ticket.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(ticket => filterStatus === 'all' || ticket.status === filterStatus)
    .filter(ticket => filterPriority === 'all' || ticket.priority === filterPriority)
    .filter(ticket => filterTeam === 'all' || ticket.team === filterTeam);

  const ticketStats = {
    total: filteredTickets.length,
    open: filteredTickets.filter(t => t.status === 'open').length,
    inProgress: filteredTickets.filter(t => t.status === 'in_progress').length,
    proposedSolution: filteredTickets.filter(t => t.status === 'proposed_solution').length,
    closed: filteredTickets.filter(t => t.status === 'closed').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tickets</h1>
          <p className="text-muted-foreground mt-1">
            Gerir tickets de suporte e solicitações de clientes
          </p>
        </div>
        <Button 
          className="bg-gradient-primary text-primary-foreground"
          onClick={handleCreateTicket}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.open}</p>
                <p className="text-sm text-muted-foreground">Abertos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.inProgress}</p>
                <p className="text-sm text-muted-foreground">Em Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.proposedSolution}</p>
                <p className="text-sm text-muted-foreground">Solução Proposta</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.closed}</p>
                <p className="text-sm text-muted-foreground">Fechados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="proposed_solution">Solução Proposta</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Equipa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Equipas</SelectItem>
                <SelectItem value="technical">Técnica</SelectItem>
                <SelectItem value="support">Suporte</SelectItem>
                <SelectItem value="sales">Vendas</SelectItem>
                <SelectItem value="management">Gestão</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando tickets...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <Ticket className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar tickets</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Tickets List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="border-2 hover:shadow-card transition-all duration-200 cursor-pointer" onClick={() => handleViewTicket(ticket)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="font-semibold text-foreground text-lg">{ticket.title}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {ticket.id}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border ${getStatusColor(ticket.status)}`}>
                      {getStatusLabel(ticket.status)}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityLabel(ticket.priority)}
                    </Badge>
                  </div>
                  
                  {ticket.description && (
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(ticket.created_at).toLocaleString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Tipo:</span> {getTypeLabel(ticket.type)}
                    </div>
                    <div>
                      <span className="font-medium">Equipa:</span> {ticket.team}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {ticket.assignee_id && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        👤 Atribuído
                      </Badge>
                    )}
                    {ticket.resolution && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        ✅ Resolvido
                      </Badge>
                    )}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewTicket(ticket); }}>
                       <Ticket className="mr-2 h-4 w-4" />
                       Ver Detalhes
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditTicket(ticket); }}>
                       <Edit className="mr-2 h-4 w-4" />
                       Editar
                     </DropdownMenuItem>
                     {ticket.status !== 'closed' && (
                       <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCloseTicket(ticket.id); }}>
                         <X className="mr-2 h-4 w-4" />
                         Fechar Ticket
                       </DropdownMenuItem>
                     )}
                   </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {!loading && !error && filteredTickets.length === 0 && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum ticket encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterTeam !== 'all'
                ? 'Nenhum ticket encontrado com os filtros aplicados.'
                : 'Nenhum ticket registado ainda.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Diálogos */}
      <TicketFormDialog
        ticket={selectedTicket}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveTicket}
      />

      <TicketDetailsDialog
        ticket={selectedTicket}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEdit={handleEditTicket}
        onDelete={() => {}} // Pode implementar depois se necessário
      />
    </div>
  );
};
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  MessageSquare
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

interface TicketType {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'proposed_solution' | 'closed';
  assignee: string;
  team: string;
  createdBy: string;
  createdAt: string;
  source: 'manual' | 'n8n_webhook' | 'call_conversion' | 'message_conversion';
  sourceDetails?: string;
}

export const TicketsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock data - would come from n8n webhooks in real app
  const [tickets] = useState<TicketType[]>([
    {
      id: 'TK-001',
      title: 'Erro na integração WhatsApp Business',
      description: 'Cliente reporta que mensagens não estão sendo entregues via webhook',
      priority: 'high',
      status: 'open',
      assignee: 'João Silva',
      team: 'Technical',
      createdBy: 'n8n_webhook',
      createdAt: '2024-01-13T10:30:00Z',
      source: 'n8n_webhook',
      sourceDetails: 'webhook-whatsapp-error'
    },
    {
      id: 'TK-002',
      title: 'Falha na síntese de voz ElevenLabs',
      description: 'API retornando erro 429 - rate limit exceeded durante chamadas',
      priority: 'critical',
      status: 'in_progress',
      assignee: 'Maria Santos',
      team: 'Technical',
      createdBy: 'n8n_webhook',
      createdAt: '2024-01-13T09:15:00Z',
      source: 'call_conversion',
      sourceDetails: 'Chamada ID: CALL-789'
    },
    {
      id: 'TK-003',
      title: 'Solicitação de configuração Twilio',
      description: 'Cliente quer adicionar novo número para campanhas',
      priority: 'medium',
      status: 'proposed_solution',
      assignee: 'Pedro Costa',
      team: 'Support',
      createdBy: 'Admin User',
      createdAt: '2024-01-12T16:45:00Z',
      source: 'manual'
    },
    {
      id: 'TK-004',
      title: 'Timeout em workflow n8n',
      description: 'Workflow de processamento de mensagens excedendo 30s',
      priority: 'medium',
      status: 'closed',
      assignee: 'João Silva',
      team: 'Technical',
      createdBy: 'n8n_webhook',
      createdAt: '2024-01-11T14:20:00Z',
      source: 'n8n_webhook',
      sourceDetails: 'workflow-message-processing'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'proposed_solution': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'proposed_solution': return <MessageSquare className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
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

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'manual': return 'Manual';
      case 'n8n_webhook': return 'n8n Webhook';
      case 'call_conversion': return 'Chamada Convertida';
      case 'message_conversion': return 'Mensagem Convertida';
      default: return source;
    }
  };

  const canViewTicket = (ticket: TicketType) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'manager' && ticket.team === user.team) return true;
    if (ticket.assignee === user?.name) return true;
    return false;
  };

  const filteredTickets = tickets
    .filter(canViewTicket)
    .filter(ticket => 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(ticket => filterStatus === 'all' || ticket.status === filterStatus)
    .filter(ticket => filterPriority === 'all' || ticket.priority === filterPriority);

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
            Gerencie ocorrências e solicitações do sistema
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
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
              <AlertCircle className="h-5 w-5 text-red-500" />
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
              <Clock className="h-5 w-5 text-blue-500" />
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
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{ticketStats.proposedSolution}</p>
                <p className="text-sm text-muted-foreground">Sol. Proposta</p>
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
                  placeholder="Buscar tickets..."
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
                <SelectItem value="all">Todas Prioridades</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="border-2 hover:shadow-card transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{ticket.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {ticket.id}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border ${getStatusColor(ticket.status)} flex items-center gap-1`}>
                      {getStatusIcon(ticket.status)}
                      {getStatusLabel(ticket.status)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{ticket.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{ticket.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Equipe:</span> {ticket.team}
                    </div>
                    <div>
                      <span className="font-medium">Origem:</span> {getSourceLabel(ticket.source)}
                    </div>
                    {ticket.sourceDetails && (
                      <div>
                        <span className="font-medium">Detalhes:</span> {ticket.sourceDetails}
                      </div>
                    )}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum ticket encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não há tickets que correspondam aos seus critérios de busca.
            </p>
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Criar Novo Ticket
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Ticket, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Phone,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { TicketDetailsDialog } from '@/components/Dialogs/TicketDetailsDialog';
import { TicketFormDialog } from '@/components/Dialogs/TicketFormDialog';
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
  status: 'open' | 'in_progress' | 'proposed_solution' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  team: string;
  category: string;
  source: 'call' | 'whatsapp' | 'manual';
  customer: string;
  customerPhone: string;
  createdAt: string;
  updatedAt: string;
}

export const TicketsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);

  const [tickets, setTickets] = useState<TicketType[]>([
    {
      id: 'tick-001',
      title: 'Configuração de automação não funciona',
      description: 'Cliente reporta que a automação criada não está a funcionar corretamente',
      status: 'open',
      priority: 'high',
      assignee: 'João Silva',
      team: 'Technical',
      category: 'Automação',
      source: 'call',
      customer: 'António Costa',
      customerPhone: '+351 912 345 678',
      createdAt: '2024-01-13T10:30:00Z',
      updatedAt: '2024-01-13T10:30:00Z'
    },
    {
      id: 'tick-002',
      title: 'Problema com integração WhatsApp',
      description: 'Mensagens não estão a ser enviadas via WhatsApp Business API',
      status: 'in_progress',
      priority: 'urgent',
      assignee: 'Maria Santos',
      team: 'Support',
      category: 'Integração',
      source: 'whatsapp',
      customer: 'Sofia Pereira',
      customerPhone: '+351 963 789 012',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T11:20:00Z'
    },
    {
      id: 'tick-003',
      title: 'Solicitação de nova funcionalidade',
      description: 'Cliente quer adicionar suporte para Telegram na automação',
      status: 'proposed_solution',
      priority: 'medium',
      assignee: 'Pedro Costa',
      team: 'Technical',
      category: 'Funcionalidade',
      source: 'manual',
      customer: 'Ricardo Oliveira',
      customerPhone: '+351 934 567 890',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-13T08:30:00Z'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'manual': return <User className="h-4 w-4" />;
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
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const filteredTickets = tickets
    .filter(ticket => 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleNewTicket = () => {
    setEditingTicket(null);
    setFormOpen(true);
  };

  const handleEdit = (ticket: TicketType) => {
    setEditingTicket(ticket);
    setFormOpen(true);
  };

  const handleDelete = (ticketId: string) => {
    setTickets(tickets.filter(t => t.id !== ticketId));
  };

  const handleSave = (ticketData: any) => {
    if (editingTicket) {
      const updatedTicket = {
        ...editingTicket,
        ...ticketData,
        updatedAt: new Date().toISOString()
      };
      setTickets(tickets.map(t => t.id === editingTicket.id ? updatedTicket : t));
    } else {
      const newTicket = {
        ...ticketData,
        id: `tick-${tickets.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTickets([...tickets, newTicket]);
    }
    setFormOpen(false);
    setEditingTicket(null);
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
          onClick={handleNewTicket}
          className="bg-gradient-primary text-primary-foreground"
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
                  placeholder="Buscar por título, cliente ou descrição..."
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
                <SelectItem value="urgent">Urgente</SelectItem>
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
                <SelectItem value="Technical">Técnica</SelectItem>
                <SelectItem value="Support">Suporte</SelectItem>
                <SelectItem value="Sales">Vendas</SelectItem>
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
                  
                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {ticket.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{ticket.customer} ({ticket.customerPhone})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getSourceIcon(ticket.source)}
                      <span>Origem: {ticket.source === 'call' ? 'Chamada' : ticket.source === 'whatsapp' ? 'WhatsApp' : 'Manual'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(ticket.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      👤 {ticket.assignee}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      🏢 {ticket.team}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      📂 {ticket.category}
                    </Badge>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedTicket(ticket);
                      setDetailsOpen(true);
                    }}>
                      <Ticket className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(ticket)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(ticket.id)} className="text-red-600">
                      <AlertTriangle className="mr-2 h-4 w-4" />
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
            <Button 
              onClick={handleNewTicket}
              className="bg-gradient-primary text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Novo Ticket
            </Button>
          </CardContent>
        </Card>
      )}

      <TicketDetailsDialog
        ticket={selectedTicket}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TicketFormDialog
        ticket={editingTicket || undefined}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSave}
      />
    </div>
  );
};